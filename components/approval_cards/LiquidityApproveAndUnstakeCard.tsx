// next and react imports
import React, { ChangeEvent } from 'react';
import Image from 'next/legacy/image';

import { toWei } from 'web3-utils';
import TextField from '@mui/material/TextField';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';
import ErrorAlert from '../ErrorAlert';

import { Typography, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// rainbowkit+ imports
import {
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
    useAccount
} from 'wagmi';

import { lp_abi } from '../../abi_objects/lp_abi';
import { staking_lp_abi } from '../../abi_objects/staking_lp_abi';
import { pair_abi } from '../../abi_objects/pair_abi';

interface LiquidityApproveAndUnstakeCardProps {
    mounted: boolean;
    isConnected: boolean;
    cardTitle: string;
}

// TODO - revert these type changes??
const LiquidityApproveAndUnstakeCard: React.FC<LiquidityApproveAndUnstakeCardProps> = ({ mounted, isConnected, cardTitle }) => {

    // TODO - get this from user input!
    const [tokenAmountToRemove, settokenAmountToRemove] = React.useState(0n);
    const [currentlyStakedTokens, setCurrentlyStakedTokens] = React.useState(0n);
    const { address } = useAccount();

    const tokenBalanceOfContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_STAKING_ADDRESS as '0x${string}',
        abi: staking_lp_abi,
        args: [address as '0x${string}'],
        functionName: "userInfo"
    } as const;

    // stake tokens function
    const stakeTokensContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_STAKING_ADDRESS as '0x${string}',
        abi: staking_lp_abi,
        args: [BigInt(tokenAmountToRemove), address as '0x${string}'],
        functionName: "withdraw",
    } as const;

    const { data: userBalance } = useReadContract({
        ...tokenBalanceOfContractConfig,
    });

    React.useEffect(() => {
        if (userBalance) {
            // TODO - check if amount comes in as WEI
            // Math.floor(Number(toWei(Number(userBalance), "wei")) / 1000000000000000000)
            const userAmountInWei = BigInt(toWei(Number(userBalance[0]), "wei"))
            // settokenAmountToRemove(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
            settokenAmountToRemove(BigInt(userBalance[0]));
            setCurrentlyStakedTokens(BigInt(userBalance[0]))
        }
    }, [userBalance]);

    //// WRITE OPERATIONS

    // let user claim rewards
    const {
        data: unstakeHash,
        writeContract: unstakeTokens,
        isPending: isunStakeLoading,
        isSuccess: isunStakeStarted,
        error: stakeError,
    } = useWriteContract();

    // ??
    const {
        data: txData,
        isSuccess: txSuccess,
        error: txError,
    } = useWaitForTransactionReceipt({
        hash: unstakeHash,
        query: {
            enabled: !!unstakeHash,
        },
    });

    // TODO - all input fields should pull user token counts!
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value, 10); // Parse the input value to a number
        settokenAmountToRemove(BigInt(newValue));
    };

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

    // <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>

    return (
        <div className="container">
            <div style={{ flex: '1 1 auto' }}>
                <div style={{ padding: '24px 24px 24px 0' }}>

                    <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>

                    <Typography variant="h5">{cardTitle}</Typography>
                    <TextField
                        label=" UNI-V2 amount (WEI)"
                        type="number"
                        value={Number(tokenAmountToRemove)}
                        onChange={handleChange}
                        style={{ marginTop: 15, marginLeft: 15 }}
                    />

                    <Typography sx={{ marginTop: "15px" }}></Typography>

                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={currentlyStakedTokens}>
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
                    <BackCard isCardFlipped={currentlyStakedTokens}>
                        <div style={{ padding: 24 }}>
                            <Image
                                src="/nft.png"
                                width="80"
                                height="80"
                                alt="RainbowKit Demo NFT"
                                style={{ borderRadius: 8 }}
                                priority
                            />
                            <Typography variant="h5" style={{ marginTop: 24, marginBottom: 6 }}>Staked LP Detected!</Typography>
                            <Typography style={{ marginBottom: 4 }}>
                                Unstake here.
                            </Typography>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{ marginTop: 6, marginLeft: 15, marginBottom: 6 }}
                                disabled={!unstakeTokens || isunStakeLoading || isunStakeStarted}
                                data-mint-started={isunStakeLoading && !isunStakeStarted}
                                data-mint-complete={!isunStakeLoading && isunStakeStarted}
                                onClick={() =>
                                    unstakeTokens?.({
                                        ...stakeTokensContractConfig,
                                    })
                                }
                            >
                                {!isunStakeLoading && !isunStakeStarted && "unstake"}
                                {isunStakeLoading && 'Executing...'}
                                {!isunStakeLoading && isunStakeStarted && 'complete'}
                            </Button>
                            {!isunStakeLoading && isunStakeStarted && (
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

/* TODO make !isMintLoading && isMintStarted the flip condition! and report the reward amount    
*/

export default LiquidityApproveAndUnstakeCard;
