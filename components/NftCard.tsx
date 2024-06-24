// next and react imports
import React, { useEffect } from 'react';
import Image from 'next/legacy/image';

// component imports
import FlipCard, { BackCard, FrontCard } from './FlipCard';

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

import { nft_abi } from '../abi_objects/nft_abi';
console.log(nft_abi)

const NftCard: React.FC<NftCardProps> = ({ mounted, isConnected, tokenId, nftContractConfig }) => {
    // state values
    const [tokenTier, setTokenTier] = React.useState(BigInt(0));
    const [tokenImageUrl, setTokenImageUrl] = React.useState("");

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

    // read operations
    const { data: tokenTierLevel } = useReadContract({
        ...nftContractConfig2,
        functionName: 'nftTiers'
    });

    React.useEffect(() => {
        if (tokenTierLevel) {
            setTokenTier(tokenTierLevel);
        }
    }, [tokenTierLevel]);

    // write opertions
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

    const isMinted = txSuccess;

    // TODO - update and test the NFT functions!
    // TODO - make the card flip based on stake status
    // TODO - get stake status in and make stake turn to unstake (or)
    // perhaps unstake is a button on the backside of the card!

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

                    

                    {mounted && isConnected && !isMinted && (
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

                    {mounted && isConnected && !isMinted && (
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

                    {mounted && isConnected && !isMinted && (
                        <Button
                            color="secondary"
                            variant="contained"
                            style={{ marginTop: 24, marginLeft: 15 }}
                            disabled={!mint || isMintLoading || isMintStarted || Number(tokenTier) < 5}
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
                            {!isMintLoading && !isMintStarted && 'stake'}
                        </Button>
                    )}

                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={isMinted}>
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
                    <BackCard isCardFlipped={isMinted}>
                        <div style={{ padding: 24 }}>
                            <Image
                                src="/nft.png"
                                width="80"
                                height="80"
                                alt="RainbowKit Demo NFT"
                                style={{ borderRadius: 8 }}
                                priority
                            />
                            <h2 style={{ marginTop: 24, marginBottom: 6 }}>NFT Minted!</h2>
                            <p style={{ marginBottom: 24 }}>
                                Your NFT will show up in your wallet in the next few minutes.
                            </p>
                            <p style={{ marginBottom: 6 }}>
                                View on{' '}
                                <a href={`https://rinkeby.etherscan.io/tx/${hash}`}>
                                    Etherscan
                                </a>
                            </p>
                            <p>
                                View on{' '}
                                <a
                                    href={`https://testnets.opensea.io/assets/rinkeby/${txData?.to}/1`}
                                >
                                    Opensea
                                </a>
                            </p>
                        </div>
                    </BackCard>
                </FlipCard>
            </div>
        </div>
    );
};

export default NftCard;
