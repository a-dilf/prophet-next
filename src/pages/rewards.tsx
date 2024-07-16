// next and react imports
import React from 'react';
import type { NextPage } from 'next';
import styles from '../styles/Rewards.module.css';

// rainbowkit+ imports
import {
    useAccount,
    useReadContract,
    type UseAccountReturnType
} from 'wagmi';

import { Typography} from '@mui/material';

import { staking_token_abi } from '../../abi_objects/staking_token_abi';
import { staking_nft_abi } from '../../abi_objects/staking_nft_abi';
import { staking_lp_abi } from '../../abi_objects/staking_lp_abi';

import LpRewardCard from '../../components/cards/LpRewardCard';
import TokenRewardCard from '../../components/cards/TokenRewardCard';
import NftRewardCard from '../../components/cards/NftRewardCard';

const Rewards: NextPage = () => {
    const [mounted, setMounted] = React.useState(false);
    const [stateTokenRewardsAmount, setStateTokenRewardsAmount] = React.useState(0n);
    const [stateNftRewardsAmount, setStateNftRewardsAmount] = React.useState(0n);
    const [stateLpRewardsAmount, setStateLpRewardsAmount] = React.useState(0n);

    React.useEffect(() => setMounted(true), []);

    const { address }: UseAccountReturnType = useAccount();

    // create contract configs for the three staking contracts
    const tokenStakingContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_STAKING_ADDRESS as '0x${string}',
        abi: staking_token_abi
    } as const;

    const nftStakingContractConfig = {
        address: process.env.NEXT_PUBLIC_NFT_STAKING_ADDRESS as '0x${string}',
        abi: staking_nft_abi
    } as const;

    const lpStakingContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_STAKING_ADDRESS as '0x${string}',
        abi: staking_lp_abi,
        args: [address]
    } as const;

    //// READ OPERATIONS
    // get user current rewards amounts
    const { data: tokenRewardsAmount } = useReadContract({
        ...tokenStakingContractConfig,
        functionName: "pendingRewards"
    });

    const { data: nftRewardsAmount } = useReadContract({
        ...nftStakingContractConfig,
        functionName: "userInfo",
        args: [address as '0x${string}']
    });

    const { data: lpRewardsAmount } = useReadContract({
        ...lpStakingContractConfig,
        functionName: "userInfo",
        args: [address as '0x${string}']
    });

    // update state with the read results
    React.useEffect(() => {
        if (tokenRewardsAmount) {
            console.log(tokenRewardsAmount)
            setStateTokenRewardsAmount(tokenRewardsAmount);
        }
    }, [tokenRewardsAmount]);

    React.useEffect(() => {
        if (nftRewardsAmount) {
            console.log(nftRewardsAmount[1])
            setStateNftRewardsAmount(nftRewardsAmount[1]);
        }
    }, [nftRewardsAmount]);

    React.useEffect(() => {
        if (lpRewardsAmount) {
            console.log(lpRewardsAmount[1])
            setStateLpRewardsAmount(lpRewardsAmount[1]);
        }
    }, [lpRewardsAmount]);

    // todo - get actual reward amounts and update the placeholder images on reward cards

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <Typography className="container" variant="h2">Rewards Zone</Typography>
            <TokenRewardCard mounted={mounted} cardTitle={"Token Staking Rewards"} rewardsAmount={Number(stateTokenRewardsAmount)}></TokenRewardCard>
            <NftRewardCard mounted={mounted} cardTitle={"NFT Staking Rewards"} rewardsAmount={Number(stateNftRewardsAmount)}></NftRewardCard>
            <LpRewardCard mounted={mounted} cardTitle={"LP Staking Rewards"} rewardsAmount={Number(stateLpRewardsAmount)}></LpRewardCard>
        </div>
    );
};

export default Rewards;
