// next and react imports
import React from 'react';
import type { NextPage } from 'next';

// rainbowkit+ imports
import {
    useAccount,
    useReadContract,
    type UseAccountReturnType
} from 'wagmi';

import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemText, ListItemButton, Grid, Button } from '@mui/material';

import { staking_token_abi } from '../../abi_objects/staking_token_abi';
import { staking_nft_abi } from '../../abi_objects/staking_nft_abi';
import { staking_lp_abi } from '../../abi_objects/staking_lp_abi';

import RewardCard from "../../components/RewardCard";




const rewards: NextPage = () => {
    const [mounted, setMounted] = React.useState(false);
    const [stateTokenRewardsAmount, setStateTokenRewardsAmount] = React.useState(0n);
    const [stateNftRewardsAmount, setStateNftRewardsAmount] = React.useState(0n);
    const [stateLpRewardsAmount, setStateLpRewardsAmount] = React.useState(0n);

    React.useEffect(() => setMounted(true), []);

    const { address, isConnected }: UseAccountReturnType = useAccount();
    const [stateRewardsAmount, setStateRewardsAmount] = React.useState(0n);

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
        args: [address]
    });

    const { data: lpRewardsAmount } = useReadContract({
        ...lpStakingContractConfig,
        functionName: "userInfo",
        args: [address]
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

    // todo - call the reward functions here and pass results to the reward cards (no address needed, easier to render...)

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <Typography className="container" variant="h2">Rewards Zone</Typography>
            <RewardCard mounted={mounted} isConnected={isConnected} cardTitle={"Token Staking Rewards"} rewardStakingContractConfig={tokenStakingContractConfig} rewardFunctionName={"claim"} rewardsAmount={Number(stateTokenRewardsAmount)}></RewardCard>
            <RewardCard mounted={mounted} isConnected={isConnected} cardTitle={"NFT Staking Rewards"} rewardStakingContractConfig={nftStakingContractConfig} rewardFunctionName={"harvest"} rewardsAmount={Number(stateNftRewardsAmount)}></RewardCard>
            <RewardCard mounted={mounted} isConnected={isConnected} cardTitle={"LP Staking Rewards"} rewardStakingContractConfig={lpStakingContractConfig} rewardFunctionName={"harvest"} rewardsAmount={Number(stateLpRewardsAmount)}></RewardCard>
        </div>
    );
};

export default rewards;
