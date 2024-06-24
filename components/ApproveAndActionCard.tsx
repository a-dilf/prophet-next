// next and react imports
import React, { useEffect } from 'react';
import Image from 'next/legacy/image';

// component imports
import FlipCard, { BackCard, FrontCard } from './FlipCard';

import { Typography, Button } from '@mui/material';

import { token_abi } from '../abi_objects/token_abi';
import { nft_abi } from '../abi_objects/nft_abi';
import { abi } from '../abi_objects/contract-abi';

import { toWei } from 'web3-utils';

// rainbowkit+ imports
import {
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi';

interface ApproveAndActionCardProps {
    mounted: boolean;
    isConnected: boolean;
    cardTitle: string;
    allowanceAmount: number
    approvingContractConfig: Object;
    mintCount: number;
}

const ApproveAndActionCard: React.FC<ApproveAndActionCardProps> = ({ mounted, isConnected, cardTitle, allowanceAmount, mintCount }) => {
    
    // TODO - make suer this BigInt isn't supposed to be an actual value
    const approvingContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [ process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}', BigInt(allowanceAmount)]
    } as const;

    const nftMintConfig = {
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}',
        abi: nft_abi,
        args: [BigInt(mintCount)]
    } as const;

    console.log(nft_abi)

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

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
                <div style={{ padding: '24px 24px 24px 0' }}>
                    <Typography variant="h5">{cardTitle}</Typography>

                    {actionError && (
                        <p style={{ marginTop: 24, color: '#FF6257' }}>
                            Error: {actionError.message}
                        </p>
                    )}
                    {actionTxError && (
                        <p style={{ marginTop: 24, color: '#FF6257' }}>
                            Error: {actionTxError.message}
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
                            {!isApproveLoading && !isApproveStarted && "approve"}
                        </Button>
                    )}

                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={allowanceAmount}>
                        Rewards to claim: {1 / 1000000000000000000}
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
                    <BackCard isCardFlipped={allowanceAmount}>
                        <div style={{ padding: 24 }}>
                            <Image
                                src="/nft.png"
                                width="80"
                                height="80"
                                alt="RainbowKit Demo NFT"
                                style={{ borderRadius: 8 }}
                                priority
                            />
                            <Typography variant="h5" style={{ marginTop: 24, marginBottom: 6 }}>Allowance provided!</Typography>
                            <Typography style={{ marginBottom: 24 }}>
                                {Math.floor(Number(toWei(Number(allowanceAmount), "wei")) / 100000000000000000)} approved for minting!
                            </Typography>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginBottom: 5, marginLeft: 15 }}
                                disabled={!action || isActionLoading || isActionStarted}
                                data-mint-loading={isActionLoading}
                                data-mint-started={isActionStarted}
                                onClick={() =>
                                    action?.({
                                        ...nftMintConfig,
                                        functionName: "mint",
                                    })
                                }
                            >
                                {isActionLoading && 'Confirming...'}
                                {isActionStarted && 'minting...'}
                                {!isActionLoading && !isActionStarted && "mint"}
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

/* TODO make !isMintLoading && isMintStarted the flip condition! and report the reward amount
                
*/

export default ApproveAndActionCard;
