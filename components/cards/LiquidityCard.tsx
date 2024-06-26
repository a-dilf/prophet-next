// next and react imports
import React, { ChangeEvent } from 'react';
import Image from 'next/legacy/image';

import { toWei } from 'web3-utils';
import TextField from '@mui/material/TextField';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';

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
        args: [process.env.NEXT_PUBLIC_UNTAXED_LIQUIDITY_ADDRESS as '0x${string}', BigInt(toWei(Number(tokenAmountToAdd), "ether"))]
    } as const;

    // collect token amount from user and get an ETH quote
    const routerContractConfig = {
        address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as '0x${string}',
        abi: router_abi,
        args: [BigInt(currentAllowance), reservesProphet, reservesEth],
        functionName: 'quote',
    } as const;

    console.log(BigInt(tokenAmountToAdd), toWei(Number(tokenAmountToAdd), "ether"), ethAmountToAddInWei)
    console.log(reservesProphet, reservesEth)

    // use ETH quote amount and token amount in proper peg ratio
    const untaxedContractConfig = {
        address: process.env.NEXT_PUBLIC_UNTAXED_LIQUIDITY_ADDRESS as '0x${string}',
        abi: untaxed_abi,
        args: [BigInt(currentAllowance)],
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
            console.log(ethAmount)
            // TODO - check if amount comes in as WEI
            // setEthAmountToAdd(BigInt(toWei(Number(ethAmount), "wei")));
            setEthAmountToAdd(ethAmount);
        }
    }, [ethAmount]);

    React.useEffect(() => {
        if (userBalance) {
            // TODO - check if amount comes in as WEI
            // Math.floor(Number(toWei(Number(userBalance), "wei")) / 1000000000000000000)
            const userAmountInWei = BigInt(toWei(Number(userBalance), "wei"))
            setTokenAmountToAdd(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
        }
    }, [userBalance]);

    // update state with the read results
    React.useEffect(() => {
        if (allowanceAmount) {
            setStateAllowanceAmount(allowanceAmount);
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

    // TODO - all input fields should pull user token counts!

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value, 10); // Parse the input value to a number
        setTokenAmountToAdd(BigInt(newValue));
    };

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
                <div style={{ padding: '24px 24px 24px 0' }}>
                    <Typography variant="h5">{cardTitle}</Typography>
                    <TextField
                        label="Token Amount"
                        type="number"
                        value={Number(tokenAmountToAdd)}
                        onChange={handleChange}
                        style={{ marginTop: 15, marginLeft: 15 }}
                    />
                    <Typography>{Number(ethAmountToAddInWei)}</Typography>

                    {addError && (
                        <p style={{ marginTop: 24, color: '#FF6257' }}>
                            Error: {addError.message}
                        </p>
                    )}
                    {txError && (
                        <p style={{ marginTop: 24, color: '#FF6257' }}>
                            Error: {txError.message}
                        </p>
                    )}

                    {mounted && isConnected && (
                        <Button
                            color="secondary"
                            variant="contained"
                            style={{ marginTop: 24, marginLeft: 15 }}
                            disabled={!approve || isApproveLoading || isApproveStarted}
                            data-mint-loading={isApproveLoading}
                            data-mint-started={isApproveStarted}
                            onClick={() =>
                                approve?.({
                                    ...approvingContractConfig,
                                    functionName: "approve",
                                })
                            }
                        >
                            {isApproveLoading && 'Confirming...'}
                            {isApproveStarted && 'approving...'}
                            {!isApproveLoading && !isApproveStarted && "approve " + tokenAmountToAdd}
                        </Button>
                    )}

                </div>
            </div>


            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={currentAllowance}>
                        provide an allowance to proceed
                        <Image
                            layout="fill"
                            src="/nft.png"
                            width="500"
                            height="500"
                            alt="NFT Image"
                            priority
                            objectFit="cover" // or 'contain' depending on your preference
                            quality={100}
                        />
                    </FrontCard>
                    <BackCard isCardFlipped={currentAllowance}>
                        <div style={{ padding: 24 }}>
                            <Image
                                src="/nft.png"
                                width="80"
                                height="80"
                                alt="RainbowKit Demo NFT"
                                style={{ borderRadius: 8 }}
                                priority
                            />
                            <Typography variant="h5" style={{ marginTop: 24, marginBottom: 6 }}>Liquidity prepared!</Typography>
                            <Typography style={{ marginBottom: 24 }}>
                                {Math.floor(Number(toWei(Number(currentAllowance), "wei")) / 1000000000000000000)} $PROPHET approved.
                            </Typography>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginTop: 24, marginLeft: 15 }}
                                disabled={!addLiquidity || isAddLoading || isAddStarted}
                                data-mint-loading={isAddLoading}
                                data-mint-started={isAddStarted}
                                onClick={() =>
                                    addLiquidity?.({
                                        ...untaxedContractConfig,
                                    })
                                }
                            >
                                {isAddLoading && 'Confirming...'}
                                {isAddStarted && 'adding...'}
                                {!isAddLoading && !isAddStarted && "add"}
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
*/

export default LiquidityCard;
