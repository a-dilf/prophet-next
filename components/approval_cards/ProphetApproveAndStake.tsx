// next and react imports
import React, { ChangeEvent } from 'react';
import Image from 'next/legacy/image';

import { toWei } from 'web3-utils';
import TextField from '@mui/material/TextField';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';
import ErrorAlert from '../ErrorAlert';

import { Typography, Button } from '@mui/material';

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

interface ProphetApproveAndStakeCardProps {
    mounted: boolean;
    isConnected: boolean;
    cardTitle: string;
    currentTokenBalanceState: bigint;
    setCurrentTokenBalanceState: React.Dispatch<React.SetStateAction<bigint>>;
}

// TODO - revert these type changes??

const ProphetApproveAndStakeCard: React.FC<ProphetApproveAndStakeCardProps> = ({ mounted, isConnected, cardTitle, currentTokenBalanceState, setCurrentTokenBalanceState }) => {

    // TODO - get this from user input!
    const [tokenAmountToAdd, setTokenAmountToAdd] = React.useState(0n);
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
        args: [address as '0x${string}', process.env.NEXT_PUBLIC_TOKEN_STAKING_ADDRESS as '0x${string}']
    } as const;

    // approval of proxy contracts
    const approvingContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [process.env.NEXT_PUBLIC_TOKEN_STAKING_ADDRESS as '0x${string}', BigInt(toWei(Number(tokenAmountToAdd), "ether"))]
    } as const;

    // stake tokens function
    const stakeTokensContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_STAKING_ADDRESS as '0x${string}',
        abi: staking_token_abi,
        args: [BigInt(tokenAmountToAdd)],
        functionName: "stake",
    } as const;

    const { data: userBalance } = useReadContract({
        ...tokenBalanceOfContractConfig,
    });

    const { data: allowanceAmount } = useReadContract({
        ...allowanceContractConfig,
        functionName: "allowance"
    });

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
            setStateAllowanceAmount(BigInt(toWei(tokenAmountToAdd, "ether")))
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
        data: stakeHash,
        writeContract: stakeTokens,
        isPending: isStakeLoading,
        isSuccess: isStakeStarted,
        error: stakeError,
    } = useWriteContract();

    // ??
    const {
        data: txData,
        isSuccess: txSuccess,
        error: txError,
    } = useWaitForTransactionReceipt({
        hash: stakeHash,
        query: {
            enabled: !!stakeHash,
        },
    });

    // TODO - all input fields should pull user token counts!
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value, 10); // Parse the input value to a number
        setCurrentTokenBalanceState(BigInt(newValue))
        setTokenAmountToAdd(BigInt(newValue));
    };

    React.useEffect(() => {
        if (isApproveStarted) {
            // triggerReRender(true);
            setStateAllowanceAmount(BigInt(toWei(tokenAmountToAdd, "ether")))
        }
    }, [isApproveStarted]);

    React.useEffect(() => {
        if (isStakeStarted) {
            console.log("state change here")
        }
    }, [isStakeStarted]);

       // error handling
       const [errorMessage, setErrorMessage] = React.useState('');

       React.useEffect(() => {
           if (stakeError) {
               setErrorMessage(stakeError["message"]);
               // setOpen(true);
           }
       }, [stakeError]);
   
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
   

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
            <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>
                <div style={{ padding: '24px 24px 24px 0' }}>
                    <Typography variant="h5">{cardTitle}</Typography>
                    <TextField
                        label="$PROPHET Amount (ETHER)"
                        type="number"
                        value={Number(tokenAmountToAdd)}
                        onChange={handleChange}
                        style={{ marginTop: 15, marginLeft: 15 }}
                    />

                    <Typography sx={{marginTop: "15px"}}></Typography>

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
                            {!isApproveLoading && !isApproveStarted && "approve " + tokenAmountToAdd}
                            {isApproveLoading && 'Executing...'}
                            {!isApproveLoading && isApproveStarted && "complete"}
                        </Button>
                    )}

                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={currentAllowance || (!isApproveLoading && isApproveStarted)}>
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
                    <BackCard isCardFlipped={currentAllowance || (!isApproveLoading && isApproveStarted)}>
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
                            <Typography style={{ marginBottom: 4}}>
                                Stake here.
                            </Typography>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginTop: 6, marginLeft: 15, marginBottom: 6 }}
                                disabled={!stakeTokens || isStakeLoading || isStakeStarted}
                                data-mint-started={isStakeLoading && !isStakeStarted}
                                data-mint-complete={!isStakeLoading && isStakeStarted}
                                onClick={() =>
                                    stakeTokens?.({
                                        ...stakeTokensContractConfig,
                                    })
                                }
                            >
                                {!isStakeLoading && !isStakeStarted && "stake"}
                                {isStakeLoading && 'Executing...'}
                                {!isStakeLoading && isStakeStarted && 'complete'}
                            </Button>
                            {!isStakeLoading && isStakeStarted && (
                                <Typography style={{ marginBottom: 6 }}>
                                    View on{' '}
                                    <a href={`https://arbiscan.io/tx/${stakeHash}`}>
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

export default ProphetApproveAndStakeCard;
