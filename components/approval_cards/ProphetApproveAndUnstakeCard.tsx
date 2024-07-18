// next and react imports
import React, { ChangeEvent } from 'react';
import Image from 'next/legacy/image';

import styles from '/src/styles/Prophet.module.css';

import { toWei } from 'web3-utils';
import TextField from '@mui/material/TextField';

// component imports
import FlipCard, { BackCard, FrontCard } from '../FlipCard';
import ErrorAlert from '../ErrorAlert';

import { Typography, Button } from '@mui/material';

// rainbowkit+ imports
import {
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
    useAccount
} from 'wagmi';

import { staking_token_abi } from '../../abi_objects/staking_token_abi';
import { token_abi } from '../../abi_objects/token_abi';

interface ProphetApproveAndUnstakeCardProps {
    mounted: boolean;
    isConnected: boolean;
    cardTitle: string;
    currentTokenBalanceState: bigint;
    setCurrentTokenBalanceState: React.Dispatch<React.SetStateAction<bigint>>;
}

// TODO - revert these type changes??

const ProphetApproveAndUnstakeCard: React.FC<ProphetApproveAndUnstakeCardProps> = ({ mounted, isConnected, cardTitle, currentTokenBalanceState, setCurrentTokenBalanceState }) => {

    // TODO - get this from user input!
    const [tokenAmountToRemove, settokenAmountToRemove] = React.useState(0n);
    const [currentAllowance, setStateAllowanceAmount] = React.useState(0n);
    const [currentlyStakedTokens, setCurrentlyStakedTokens] = React.useState(0n);

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

    // stake tokens function
    const stakeTokensContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_STAKING_ADDRESS as '0x${string}',
        abi: staking_token_abi,
        args: [BigInt(tokenAmountToRemove)],
        functionName: "unstake",
    } as const;

    // approval of proxy contracts
    const stakedAmountContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_STAKING_ADDRESS as '0x${string}',
        abi: staking_token_abi,
        args: [address as '0x${string}'],
        functionName: 'stakedAmounts'
    } as const;

    const { data: stakedAmount } = useReadContract({
        ...stakedAmountContractConfig,
    });

    const { data: allowanceAmount } = useReadContract({
        ...allowanceContractConfig,
        functionName: "allowance"
    });

    React.useEffect(() => {
        if (stakedAmount) {
            settokenAmountToRemove(BigInt(stakedAmount[0]));
            setCurrentlyStakedTokens(BigInt(stakedAmount[0]))
        }
    }, [stakedAmount]);

    // update state with the read results
    React.useEffect(() => {
        if (allowanceAmount) {
            setStateAllowanceAmount(BigInt(toWei(tokenAmountToRemove, "ether")))
        }
    }, [allowanceAmount]);

    //// WRITE OPERATIONS
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
        settokenAmountToRemove(BigInt(newValue));
    };

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

    return (
        <div className="container" style={{ marginTop: "20px" }}>
            <div style={{ flex: '1 1 auto' }}>
                <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>
                <div style={{ padding: '24px 24px 24px 0' }}>
                    <Typography variant="h5">{cardTitle}</Typography>
                    <TextField className={styles.textbox}
                        label="$PROPHET Amount (ETHER)"
                        type="number"
                        value={Number(tokenAmountToRemove)}
                        onChange={handleChange}
                        InputLabelProps={{
                            style: {color: 'violet', transform: 'translateY(-20px'}
                          }}
                          InputProps={{
                            style: {color : 'black'}
                          }}
                        style={{ marginTop: 15, marginLeft: 15 }}
                    />

                </div>
            </div>

            <div style={{ flex: '0 0 auto' }}>
                <FlipCard>
                    <FrontCard isCardFlipped={currentlyStakedTokens}>
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
                            <Typography variant="h5" style={{ marginTop: 24, marginBottom: 6 }}>Tokens Staked!</Typography>
                            <Typography style={{ marginBottom: 4 }}>
                                Unstake here.
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
                                {!isStakeLoading && !isStakeStarted && "unstake"}
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

export default ProphetApproveAndUnstakeCard;
