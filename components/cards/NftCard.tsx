// next and react imports
import React, { useEffect } from 'react';
import Image from 'next/legacy/image';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';

import { Typography, Button } from '@mui/material';

// rainbowkit+ imports
import {
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi';

interface NftCardProps {
    mounted: boolean;
    isConnected: boolean;
    tokenId: number;
    nftContractConfig: object;
}

import { nft_abi } from '../../abi_objects/nft_abi';
import { staking_nft_abi } from '../../abi_objects/staking_nft_abi';

const NftCard: React.FC<NftCardProps> = ({ mounted, isConnected, tokenId, nftContractConfig }) => {
    // state values
    const [tokenTier, setTokenTier] = React.useState(BigInt(0));
    const [tokenImageUrl, setTokenImageUrl] = React.useState("");
    const [tokenStakeStatusForButton, setTokenStakeStatusForButton] = React.useState(false);

    // get image URL for display
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://api.prophetlady.com/api/v1/nft/' + tokenId + '.json');
            const data = await response.json();
            // Assuming the image URL is directly accessible in the data object
            setTokenImageUrl(data.image || '');
        }

        fetchData();
    }, []);

    const nftContractConfig2 = {
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}',
        abi: nft_abi,
        args: [BigInt(tokenId)]
    } as const;

    const unstakeNftContractConfig = {
        address: process.env.NEXT_PUBLIC_NFT_STAKING_ADDRESS as '0x${string}',
        abi: staking_nft_abi,
        args: [BigInt(tokenId)]
    } as const;

    // read operations
    const { data: tokenTierLevel } = useReadContract({
        ...nftContractConfig2,
        functionName: 'nftTiers'
    });

    const { data: tokenStakeStatus } = useReadContract({
        ...nftContractConfig2,
        functionName: 'stakedTokens'
    });

    React.useEffect(() => {
        if (tokenTierLevel) {
            setTokenTier(tokenTierLevel);
        }
    }, [tokenTierLevel]);

    React.useEffect(() => {
        if (tokenStakeStatus) {
            setTokenStakeStatusForButton(tokenStakeStatus);
        }
    }, [tokenStakeStatus]);

    //// WRITE
    // mint NFT
    const {
        data: hash,
        writeContract: mint,
        isPending: isMintLoading,
        isSuccess: isMintStarted,
        error: mintError,
    } = useWriteContract();

    // ??
    const {
        data: txData,
        isSuccess: txSuccess,
        error: txError,
    } = useWaitForTransactionReceipt({
        hash,
        query: {
            enabled: !!hash,
        },
    });

    // stake NFT
    const {
        data: stakeHash,
        writeContract: stake,
        isPending: isStakeLoading,
        isSuccess: isStakeStarted,
        error: unStakeError,
    } = useWriteContract();

    // ??
    const {
        data: unStakeData,
        isSuccess: unStakeSuccess,
        error: unsSakeTxError,
    } = useWaitForTransactionReceipt({
        hash: stakeHash,
        query: {
            enabled: !!hash,
        },
    });

    // unstake NFT
    const {
        data: unstakeHash,
        writeContract: unstake,
        isPending: isUnstakeLoading,
        isSuccess: isUnstakeStarted,
        error: unstakeError,
    } = useWriteContract();

    // ??
    const {
        data: unstakeData,
        isSuccess: unstakeSuccess,
        error: unstakeTxError,
    } = useWaitForTransactionReceipt({
        hash: unstakeHash,
        query: {
            enabled: !!hash,
        },
    });

    
    

    // TODO - update and test the NFT functions!
    // TODO - make the card flip based on stake status
    // TODO - get stake status in and make stake turn to unstake (or)
    // perhaps unstake is a button on the backside of the card!
    // TODO - make level up and MAX button actually do something

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
                <div style={{ padding: '24px 24px 24px 0' }}>
                    <Typography variant="h5">Prophet Lady: {Number(tokenId)}</Typography>
                    <Typography style={{ margin: '12px 0 24px' }}>
                        Tier: {Number(tokenTier)}
                    </Typography>

                    {mintError && (
                        <p style={{ marginTop: 24, color: '#FF6257' }}>
                            Error: {mintError.message}
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
                            disabled={!mint || isMintLoading || isMintStarted || Number(tokenTier) >= 5}
                            data-mint-loading={isMintLoading}
                            data-mint-started={isMintStarted}
                            onClick={() =>
                                mint?.({
                                    ...nftContractConfig2,
                                    functionName: 'mint',
                                })
                            }
                        >
                            {isMintLoading && 'Waiting for approval'}
                            {isMintStarted && 'Minting...'}
                            {!isMintLoading && !isMintStarted && 'Lvl'}
                        </Button>
                    )}

                    {mounted && isConnected && (
                        <Button
                            color="secondary"
                            variant="contained"
                            style={{ marginTop: 24, marginLeft: 15 }}
                            disabled={!mint || isMintLoading || isMintStarted || Number(tokenTier) >= 5}
                            data-mint-loading={isMintLoading}
                            data-mint-started={isMintStarted}
                            onClick={() =>
                                mint?.({
                                    ...nftContractConfig2,
                                    functionName: 'mint',
                                })
                            }
                        >
                            {isMintLoading && 'Waiting for approval'}
                            {isMintStarted && 'Minting...'}
                            {!isMintLoading && !isMintStarted && 'MAX'}
                        </Button>
                    )}
                    
                    {mounted && isConnected && (
                        <Button
                            color="secondary"
                            variant="contained"
                            style={{ marginTop: 24, marginLeft: 15 }}
                            disabled={!stake || isStakeLoading || isStakeStarted || tokenStakeStatusForButton || (Number(tokenTier) < 5)}
                            data-mint-loading={isStakeLoading}
                            data-mint-started={isStakeStarted}
                            onClick={() =>
                                stake?.({
                                    ...nftContractConfig2,
                                    functionName: 'stake',
                                })
                            }
                        >
                            {isStakeLoading && 'Waiting for approval'}
                            {isStakeStarted && 'Minting...'}
                            {!isStakeLoading && !isStakeStarted && 'stake'}
                        </Button>
                    )}

                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={tokenStakeStatus}>
                        <>
                            {tokenImageUrl && (
                                <Image
                                    layout="fill"
                                    src={tokenImageUrl}
                                    width="500"
                                    height="600"
                                    alt="NFT Image"
                                    priority
                                    objectFit="cover" // or 'contain' depending on your preference
                                    quality={100}
                                />
                            )}
                            {!tokenImageUrl && <p>Loading NFT image...</p>}
                        </>
                    </FrontCard>
                    <BackCard isCardFlipped={tokenStakeStatus}>
                        <div style={{ padding: 24 }}>
                            <Image
                                src={tokenImageUrl}
                                width="60"
                                height="80"
                                alt="RainbowKit Demo NFT"
                                style={{ borderRadius: 8 }}
                                priority
                            />
                            <Typography variant="h5" style={{ marginTop: 24, marginBottom: 6 }}>NFT currently staked!</Typography>
                            <Typography style={{ marginBottom: 24 }}>
                                NFT generating rewards from NFT staking reward pool.
                            </Typography>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginBottom: 5, marginLeft: 15 }}
                                data-mint-loading={isUnstakeLoading}
                                data-mint-started={isUnstakeStarted}
                                onClick={() =>
                                    unstake?.({
                                        ...unstakeNftContractConfig,
                                        functionName: "withdraw",
                                    })
                                }
                            >
                                {isUnstakeLoading && 'Confirming...'}
                                {isUnstakeStarted && 'minting...'}
                                {!isUnstakeLoading && !isUnstakeStarted && "unstake"}
                            </Button>
                            {!isUnstakeLoading && isUnstakeStarted && (
                                <Typography style={{ marginBottom: 6 }}>
                                    View on{' '}
                                    <a href={`https://arbiscan.io/tx/${unstakeHash}`}>
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

export default NftCard;
