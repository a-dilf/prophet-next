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

import { staking_token_abi } from '../abi_objects/staking_token_abi';

interface RewardCardProps {
    mounted: boolean;
    isConnected: boolean;
    cardTitle: string;
    rewardStakingContractConfig: object;
    rewardFunctionName: "claim";
    rewardsAmount: Number;
}

// TODO - revert rewardFunctionName type changes??

const RewardCard: React.FC<RewardCardProps> = ({ mounted, isConnected, cardTitle, rewardStakingContractConfig, rewardFunctionName, rewardsAmount }) => {

    // let user claim rewards
    const {
        data: hash,
        writeContract: claim,
        isPending: isClaimLoading,
        isSuccess: isClaimStarted,
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

    const tokenStakingContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_STAKING_ADDRESS as '0x${string}',
        abi: staking_token_abi
    } as const;

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
                <div style={{ padding: '24px 24px 24px 0'}}>
                    <Typography variant="h5">{cardTitle}</Typography>

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

                    {mounted && isConnected && !(!isClaimLoading && isClaimStarted) && (
                        <Button
                            color="secondary"
                            variant="contained"
                            style={{ marginTop: 24, marginLeft: 15 }}
                            disabled={!claim || isClaimLoading || isClaimStarted}
                            data-mint-loading={isClaimLoading}
                            data-mint-started={isClaimStarted}
                            onClick={() =>
                                claim?.({
                                    ...tokenStakingContractConfig,
                                    functionName: rewardFunctionName,
                                })
                            }
                        >
                            {isClaimLoading && 'Confirming...'}
                            {isClaimStarted && rewardFunctionName + 'ing...'}
                            {!isClaimLoading && !isClaimStarted && rewardFunctionName}
                        </Button>
                    )}

                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={!isClaimLoading && isClaimStarted}>
                        Rewards to claim: {Number(rewardsAmount) / 1000000000000000000}
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
                    <BackCard isCardFlipped={!isClaimLoading && isClaimStarted}>
                        <div style={{ padding: 24 }}>
                            <Image
                                src="/nft.png"
                                width="80"
                                height="80"
                                alt="RainbowKit Demo NFT"
                                style={{ borderRadius: 8 }}
                                priority
                            />
                            <Typography variant="h5" style={{ marginTop: 24, marginBottom: 6 }}>Rewards claimed!</Typography>
                            <Typography style={{ marginBottom: 24 }}>
                                Stick around for more tomorrow!
                            </Typography>
                            <Typography style={{ marginBottom: 6 }}>
                                View on{' '}
                                <a href={`https://arbiscan.io/tx/${hash}`}>
                                    Arbiscan
                                </a>
                            </Typography>
                        </div>
                    </BackCard>
                </FlipCard>
            </div>
        </div>
    );
};

/* TODO make !isMintLoading && isMintStarted the flip condition! and report the reward amount
                
*/

export default RewardCard;
