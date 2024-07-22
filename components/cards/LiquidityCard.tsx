// next and react imports
import React, { ChangeEvent } from 'react';
import Image from 'next/legacy/image';

import styles from '/src/styles/Prophet.module.css';

import { toWei } from 'web3-utils';
import TextField from '@mui/material/TextField';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';
import ErrorAlert from '../ErrorAlert';

import { Typography, Button } from '@mui/material';

import { router_abi } from '../../abi_objects/router_abi';
import { untaxed_abi } from '../../abi_objects/untaxed_abi';

// rainbowkit+ imports
import {
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
    useAccount
} from 'wagmi';

import { staking_token_abi } from '../../abi_objects/staking_token_abi';
import { token_abi } from '../../abi_objects/token_abi';
import { pair_abi } from '../../abi_objects/pair_abi';

interface LiquidityCardProps {
    mounted: boolean;
    isConnected: boolean;
    cardTitle: string;
}

// TODO - revert these type changes??

const LiquidityCard: React.FC<LiquidityCardProps> = ({ mounted, isConnected, cardTitle }) => {

    // TODO - get this from user input!
    const [tokenAmountToAdd, setTokenAmountToAdd] = React.useState(0n);
    const [maxAllowance, setMaxAllowance] = React.useState(0n);
    const [ethAmountToAddInWei, setEthAmountToAdd] = React.useState(0n);
    const [reservesProphet, setReservesProphet] = React.useState(0n);
    const [reservesEth, setReservesEth] = React.useState(0n);
    const [currentAllowance, setStateAllowanceAmount] = React.useState(0n);

    const { address } = useAccount();

    const tokenBalanceOfContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [address as '0x${string}'],
        functionName: "balanceOf"
    } as const;

    // contract configs
    // allowance read contract
    const allowanceContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [address as '0x${string}', process.env.NEXT_PUBLIC_UNTAXED_LIQUIDITY_ADDRESS as '0x${string}']
    } as const;

    // approval of proxy contracts
    const approvingContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [process.env.NEXT_PUBLIC_UNTAXED_LIQUIDITY_ADDRESS as '0x${string}', BigInt(toWei(Number(maxAllowance), "ether"))]
    } as const;

    // collect token amount from user and get an ETH quote
    const routerContractConfig = {
        address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as '0x${string}',
        abi: router_abi,
        args: [BigInt(Number(tokenAmountToAdd) * 1000000000000000000), reservesProphet, reservesEth],
        functionName: 'quote',
    } as const;

    // use ETH quote amount and token amount in proper peg ratio
    const untaxedContractConfig = {
        address: process.env.NEXT_PUBLIC_UNTAXED_LIQUIDITY_ADDRESS as '0x${string}',
        abi: untaxed_abi,
        args: [BigInt(Number(tokenAmountToAdd) * 1000000000000000000)],
        value: BigInt(ethAmountToAddInWei),
        functionName: "addLiquidityETHUntaxed",
    } as const;

    const pairContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_POOL_ADDRESS as '0x${string}',
        abi: pair_abi
    } as const;

    //// READ OPERATIONS
    const { data: reserves } = useReadContract({
        ...pairContractConfig,
        functionName: 'getReserves',
    });

    const { data: userBalance } = useReadContract({
        ...tokenBalanceOfContractConfig,
    });

    const { data: ethAmount } = useReadContract({
        ...routerContractConfig,
    });

    const { data: allowanceAmount } = useReadContract({
        ...allowanceContractConfig,
        functionName: "allowance"
    });

    React.useEffect(() => {
        if (reserves) {
            // TODO - check if amount comes in as WEI
            // setEthAmountToAdd(BigInt(toWei(Number(ethAmount), "wei")));
            setReservesEth(reserves[0])
            setReservesProphet(reserves[1]);
        }
    }, [reserves]);

    //// READ OPERATIONS
    React.useEffect(() => {
        if (ethAmount) {
            setEthAmountToAdd(ethAmount);
        }
    }, [ethAmount]);

    React.useEffect(() => {
        if (userBalance) {
            // TODO - check if amount comes in as WEI
            // Math.floor(Number(toWei(Number(userBalance), "wei")) / 1000000000000000000)
            const userAmountInWei = BigInt(toWei(Number(userBalance), "wei"))
            setTokenAmountToAdd(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
            setMaxAllowance(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
        }
    }, [userBalance]);

    // update state with the read results
    React.useEffect(() => {
        if (allowanceAmount) {
            // setStateAllowanceAmount(BigInt(toWei(allowanceAmount, "ether")))
            setStateAllowanceAmount(allowanceAmount)
        }
    }, [allowanceAmount]);

    //// WRITE OPERATIONS
    // let user approve $PROPHET tokens
    const {
        data: hash,
        writeContract: approve,
        isPending: isApproveLoading,
        isSuccess: isApproveStarted,
        error: approveError,
    } = useWriteContract();

    // approve actions
    const {
        data: approveTxData,
        isSuccess: approveTxSuccess,
        error: approveTxError,
    } = useWaitForTransactionReceipt({
        hash,
        query: {
            enabled: !!hash,
        },
    });

    // let user claim rewards
    const {
        data: addHash,
        writeContract: addLiquidity,
        isPending: isAddLoading,
        isSuccess: isAddStarted,
        error: addError,
    } = useWriteContract();

    // ??
    const {
        data: txData,
        isSuccess: txSuccess,
        error: txError,
    } = useWaitForTransactionReceipt({
        hash: addHash,
        query: {
            enabled: !!addHash,
        },
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) > 0) {
            const newValue = parseInt(event.target.value, 10); // Parse the input value to a number
            setTokenAmountToAdd(BigInt(newValue))
        } else {
            setTokenAmountToAdd(BigInt(1))
        }
    };

    React.useEffect(() => {
        if (isApproveStarted) {
            // triggerReRender(true);
            setStateAllowanceAmount(BigInt(toWei(tokenAmountToAdd, "ether")))
        }
    }, [isApproveStarted]);

    React.useEffect(() => {
        if (isAddStarted) {
            setReservesProphet(reservesProphet + BigInt(toWei(tokenAmountToAdd, "ether")))
            setReservesEth(reservesEth + BigInt(toWei(ethAmountToAddInWei, "ether")))
        }
    }, [isAddStarted]);

    // error handling
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
        if (addError) {
            setErrorMessage(addError["message"]);
            // setOpen(true);
        }
    }, [addError]);

    React.useEffect(() => {
        if (txError) {
            setErrorMessage(txError["message"]);
            // setOpen(true);
        }
    }, [txError]);

    React.useEffect(() => {
        if (approveError) {
            setErrorMessage(approveError["message"]);
            // setOpen(true);
        }
    }, [approveError]);

    React.useEffect(() => {
        if (approveTxError) {
            setErrorMessage(approveTxError["message"]);
            // setOpen(true);
        }
    }, [approveTxError]);

    // import ErrorAlert from '../ErrorAlert';
    // <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
                <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>
                <div style={{ padding: '24px 24px 24px 0' }}>
                    <Typography variant="h5">{cardTitle}</Typography>
                    <TextField className={styles.textbox}
                        label="$PROPHET Amount"
                        type="number"
                        value={Number(tokenAmountToAdd)}
                        onChange={handleChange}
                        InputLabelProps={{
                            style: { color: 'violet', transform: 'translateY(-20px)' }
                        }}
                        InputProps={{
                            style: { color: "black" }
                        }}
                        style={{ marginTop: 15, marginLeft: 15 }}
                    />

                    <Typography sx={{ marginTop: "15px" }}>Approve $PROPHET for addition</Typography>

                    {mounted && isConnected && (
                        <Button
                            color="secondary"
                            variant="contained"
                            style={{ marginTop: 24, marginLeft: 15 }}
                            disabled={!approve || isApproveLoading || isApproveStarted}
                            data-mint-started={isApproveLoading && !isApproveStarted}
                            data-mint-complete={!isApproveLoading && isApproveStarted}
                            onClick={() =>
                                approve?.({
                                    ...approvingContractConfig,
                                    functionName: "approve",
                                })
                            }
                        >
                            {!isApproveLoading && !isApproveStarted && "approve"}
                            {isApproveLoading && 'Executing...'}
                            {!isApproveLoading && isApproveStarted && "complete"}
                        </Button>
                    )}

                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={currentAllowance || (!isApproveLoading && isApproveStarted)}>
                        <Image
                            layout="fill"
                            src="/final logo small.png"
                            width="500"
                            height="500"
                            alt="NFT Image"
                            priority
                            objectFit="cover" // or 'contain' depending on your preference
                            quality={100}
                        />
                    </FrontCard>
                    <BackCard isCardFlipped={currentAllowance || (!isApproveLoading && isApproveStarted)}>
                        <div style={{ padding: 24 }}>
                            <Image
                                src="/final logo small.png"
                                width="80"
                                height="80"
                                alt="RainbowKit Demo NFT"
                                style={{ borderRadius: 8 }}
                                priority
                            />
                            <Typography variant="h5" style={{ marginTop: 24, marginBottom: 6 }}>$PROPHET prepared!</Typography>
                            <Typography style={{ marginBottom: 4 }}>
                                {Number(tokenAmountToAdd)} $PROPHET requires {Number(toWei(Number(ethAmountToAddInWei), "wei")) / 1000000000000000000} ETH.
                            </Typography>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginTop: 6, marginLeft: 15, marginBottom: 6 }}
                                disabled={!addLiquidity || isAddLoading || isAddStarted}
                                data-mint-started={isAddLoading && !isAddStarted}
                                data-mint-complete={!isAddLoading && isAddStarted}
                                onClick={() =>
                                    addLiquidity?.({
                                        ...untaxedContractConfig,
                                    })
                                }
                            >
                                {!isAddLoading && !isAddStarted && "add approved liquidity"}
                                {isAddLoading && 'Executing...'}
                                {!isAddLoading && isAddStarted && 'complete'}
                            </Button>
                            {!isAddLoading && isAddStarted && (
                                <Typography style={{ marginBottom: 6 }}>
                                    View on{' '}
                                    <a href={`https://arbiscan.io/tx/${addHash}`}>
                                        Arbiscan
                                    </a>
                                </Typography>
                            )}

                        </div>
                    </BackCard>
                </FlipCard>
            </div>
        </div>
    );
};

/* TODO make !isMintLoading && isMintStarted the flip condition! and report the reward amount    
{Math.floor(Number(toWei(Number(tokenAmountToAdd), "wei")) / 1000000000000000000)} $PROPHET requires {Number(toWei(Number(ethAmountToAddInWei), "wei")) / 1000000000000000000} ETH.
*/

export default LiquidityCard;
