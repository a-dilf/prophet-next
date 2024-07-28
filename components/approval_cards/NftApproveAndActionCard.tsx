// next and react imports
import React, { useCallback, useState } from 'react';
import Image from 'next/legacy/image';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';
import ErrorAlert from '../ErrorAlert';

import { Typography, Button, Box } from '@mui/material';

import { token_abi } from '../../abi_objects/token_abi';
import { nft_abi } from '../../abi_objects/nft_abi';

import { toWei } from 'web3-utils';

// rainbowkit+ imports
import {
    useWaitForTransactionReceipt,
    useWriteContract,
    useAccount,
    useReadContract
} from 'wagmi';

// TODO - minting button gets stuck on minting forever...

interface NftApproveAndActionCardProps {
    mounted: boolean;
    isConnected: boolean;
    cardTitle: string;
    amountToApprove: number;
    allowanceAmount: number;
    mintCount: number;
    totalMinted: BigInt;
    setTotalMinted: React.Dispatch<React.SetStateAction<bigint>>;
    setOwnedNftCardProps: React.Dispatch<React.SetStateAction<any[]>>;
    setStateAllowanceAmount: React.Dispatch<React.SetStateAction<bigint>>;
}

const NftApproveAndActionCard: React.FC<NftApproveAndActionCardProps> = ({ mounted, isConnected, cardTitle, amountToApprove, allowanceAmount, mintCount, totalMinted, setTotalMinted, setOwnedNftCardProps, setStateAllowanceAmount }) => {
    const [amountMintable, setAmountMintable] = React.useState(0);
    const [currentTokenBalanceState, setCurrentTokenBalanceState] = React.useState(0n);

    const { address } = useAccount();

    const nftContractConfig = {
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}',
        abi: nft_abi
    } as const;

    const approvingContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}', BigInt(currentTokenBalanceState)]
    } as const;

    const nftMintConfig = {
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}',
        abi: nft_abi,
        args: [BigInt(mintCount)]
    } as const;

    const balanceOfContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [address as '0x${string}'],
        functionName: 'balanceOf',
    } as const;

    //// READ OPERATIONS
    const { data: currentBalance } = useReadContract({
        ...balanceOfContractConfig,
    });

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

    const {
        data: actionHash,
        writeContract: action,
        isPending: isActionLoading,
        isSuccess: isActionStarted,
        error: actionError,
    } = useWriteContract();

    // use the approved funds actions
    const {
        data: actionTxData,
        isSuccess: actionTxSuccess,
        error: actionTxError,
    } = useWaitForTransactionReceipt({
        hash: actionHash,
        query: {
            enabled: !!actionHash,
        },
    });

    //// STATE UPDATES amountMintable
    React.useEffect(() => {
        if (allowanceAmount && !isApproveLoading && !isApproveStarted) {
            let allowance = Math.floor(Number(toWei(Number(allowanceAmount), "wei")) / 1000000000000000000)
            setAmountMintable(allowance / 400000);
        }
    }, [allowanceAmount, isApproveLoading, isApproveStarted]);

    React.useEffect(() => {
        if (!isApproveLoading && isApproveStarted) {
            setAmountMintable(mintCount);
            setStateAllowanceAmount(BigInt(Number(toWei((mintCount + 1) * 400000, "ether"))));
        }
    }, [isApproveLoading, isApproveStarted]);

    React.useEffect(() => {
        if (amountMintable) {
            console.log(amountMintable)
        }
    }, [amountMintable]);

    // update list of minted NFTs after mint
    React.useEffect(() => {

        if (!isActionLoading && isActionStarted) {
            console.log("yes")
            setTotalMinted((prevCount) => BigInt(prevCount + BigInt(mintCount)));

            /*
            const cardsToAdd = []
            for (let i = Number(totalMinted); i < Number(mintCount + Number(totalMinted)); i++) {
                cardsToAdd.push(i)
            }
            
            const nftCardsData = cardsToAdd.map(tokenId => ({
                mounted: mounted, // Example value, replace with actual logic if needed
                isConnected: isConnected, // Example value, replace with actual logic if needed
                tokenId,
                nftContractConfig: nftContractConfig, // Example value, replace with actual logic if needed
            }));
            
            setOwnedNftCardProps((prevCards) => [...prevCards, ...nftCardsData]);
            */
        }
    }, [isActionLoading, isActionStarted]);

    // error handling
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
        if (actionError) {
            setErrorMessage(actionError["message"]);
            // setOpen(true);
        }
    }, [actionError]);

    React.useEffect(() => {
        if (actionTxError) {
            setErrorMessage(actionTxError["message"]);
            // setOpen(true);
        }
    }, [actionTxError]);

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

    React.useEffect(() => {
        if (currentBalance) {
            setCurrentTokenBalanceState(currentBalance);
        }
    }, [currentBalance]);

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
                <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>
                <div style={{ padding: '24px 24px 24px 0' }}>
                    <Typography variant="h5">{cardTitle}</Typography>
                    <Typography sx={{ marginTop: 1, fontWeight: 'bold' }} >Tokens must be approved</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>for mint and burn operations!</Typography>

                    {mounted && isConnected && currentTokenBalanceState >= 400000 && (
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

                    {mounted && isConnected && currentTokenBalanceState < 400000 && (
                        <Box display="flex" alignItems="center" sx={{marginTop: "15px"}}>
                            <div style={{ paddingRight: "10px" }}>
                                <Typography ml={1}>Buy</Typography>
                                <Typography ml={1}>400,000+</Typography>
                                <Typography ml={1}>$PROPHET</Typography>
                            </div>
                            <Image
                                layout="fixed"
                                src="/gigachad_emoji.png"
                                width="50"
                                height="50"
                                alt="NFT Image"
                                priority
                                objectFit="cover" // or 'contain' depending on your preference
                                quality={100}
                            />
                        </Box>
                    )}

                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={(allowanceAmount && Math.floor(Number(toWei(Number(allowanceAmount), "wei")) / 100000000000000000) > 1) || (!isApproveLoading && isApproveStarted)}>
                        <Image
                            layout="fill"
                            src="/gradient_card.png"
                            width="500"
                            height="500"
                            alt="NFT Image"
                            priority
                            objectFit="cover" // or 'contain' depending on your preference
                            quality={100}
                        />
                    </FrontCard>
                    <BackCard isCardFlipped={(allowanceAmount && Math.floor(Number(toWei(Number(allowanceAmount), "wei")) / 100000000000000000) > 1) || (!isApproveLoading && isApproveStarted)}>
                        <div style={{ padding: 24 }}>
                            <Image
                                src="/final logo small.png"
                                width="80"
                                height="80"
                                alt="RainbowKit Demo NFT"
                                style={{ borderRadius: 8 }}
                                priority
                            />
                            <Typography variant="h5" style={{ marginTop: 24, marginBottom: 6 }}>{Math.floor(amountMintable)} mintable!</Typography>
                            <Typography style={{ marginBottom: 10 }}>
                                $PROPHET approved for burn.
                            </Typography>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginBottom: 5, marginLeft: 15 }}
                                disabled={!action || isActionLoading || isActionStarted || amountMintable < mintCount}
                                data-mint-started={isActionLoading && !isActionStarted}
                                data-mint-loading={!isActionLoading && isActionStarted}
                                onClick={() =>
                                    action?.({
                                        ...nftMintConfig,
                                        functionName: "mint",
                                    })
                                }
                            >
                                {!isActionLoading && !isActionStarted && "mint " + mintCount}
                                {isActionLoading && 'Executing...'}
                                {!isActionLoading && isActionStarted && 'complete...'}
                            </Button>
                            {!isActionLoading && isActionStarted && (
                                <Typography style={{ marginBottom: 6 }}>
                                    View on{' '}
                                    <a href={`https://arbiscan.io/tx/${actionHash}`}>
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

//                                         {Math.floor(Number(toWei(Number(allowanceAmount), "wei")) / 1000000000000000000)} $PROPHET approved for burn.
/* TODO make !isMintLoading && isMintStarted the flip condition! and report the reward amount
                
*/

export default NftApproveAndActionCard;
