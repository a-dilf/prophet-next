// next and react imports
import React from 'react';
import Image from 'next/legacy/image';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';
import { Typography, LinearProgress } from '@mui/material';

interface IdoVaultCardProps {
    cardTitle: string;
    tokensLeft: string;
    stageNumber: string;
    ethPerTokenRate: string;
}


// TODO - revert these type changes??

const IdoVaultCard: React.FC<IdoVaultCardProps> = ({ cardTitle, tokensLeft, stageNumber, ethPerTokenRate }) => {

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
                <div style={{ padding: '24px 24px 24px 0' }}>
                    <Typography variant="h5">{cardTitle}</Typography>
                </div>
                <div>
                    <Typography>{ethPerTokenRate}</Typography>
                    <Typography>ETH per token.</Typography>
                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={!ethPerTokenRate}>
                        <div style={{ padding: '24px 24px 24px 0' }}>
                            <Typography variant="h5">Tokens left: {tokensLeft}</Typography>
                            <LinearProgress color="secondary"
                                sx={{
                                    height: 25, // Adjust the height as needed
                                    width: '80%', // Make the bar wider
                                }} variant="determinate" value={Number(tokensLeft) / 20000000000} />
                        </div>
                    </FrontCard>
                    <BackCard isCardFlipped={!ethPerTokenRate}>
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
                        </div>
                    </BackCard>
                </FlipCard>
            </div>
        </div>
    );
};

/* TODO make !isMintLoading && isMintStarted the flip condition! and report the reward amount
                
*/

export default IdoVaultCard;
