// next and react imports
import React from 'react';
import Image from 'next/legacy/image';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';
import ErrorAlert from '../ErrorAlert';

import { Typography, Button } from '@mui/material';

// rainbowkit+ imports
import {
    useAccount,
    useWaitForTransactionReceipt,
    useWriteContract,
    type UseAccountReturnType
} from 'wagmi';

import { staking_token_abi } from '../../abi_objects/staking_token_abi';

interface TokenRewardCardProps {
    mounted: boolean;
    cardTitle: string;
    rewardsAmount: Number;
}

const TokenRewardCard: React.FC<TokenRewardCardProps> = ({ mounted, cardTitle, rewardsAmount }) => {

    const { isConnected }: UseAccountReturnType = useAccount();

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

    // error handling
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
        if (mintError) {
            setErrorMessage(mintError["message"]);
            // setOpen(true);
        }
    }, [mintError]);

    React.useEffect(() => {
        if (txError) {
            setErrorMessage(txError["message"]);
            // setOpen(true);
        }
    }, [txError]);

    return (
        <div className="container">
            <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>
            <div style={{ flex: '1 1 auto' }}>
                <div style={{ padding: '24px 24px 24px 0'}}>
                    <Typography variant="h5">{cardTitle}</Typography>

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
                                    functionName: "claim",
                                })
                            }
                        >
                            {isClaimLoading && 'Confirming...'}
                            {isClaimStarted &&  'claiming...'}
                            {!isClaimLoading && !isClaimStarted && "claim"}
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

export default TokenRewardCard;
