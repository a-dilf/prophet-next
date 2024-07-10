// next and react imports
import React from 'react';
import type { NextPage } from 'next';

import { Typography } from '@mui/material';

// rainbowkit+ imports
import {
    useAccount,
    useReadContract,
} from 'wagmi';

// abi objects
import { pair_abi } from '../../abi_objects/pair_abi';
// component imports
import LiquidityCard from '../../components/cards/LiquidityCard';
import RemoveLiquidityCard from '../../components/cards/RemoveLiquidityCard';
import LiquidityApproveAndStakeCard from '../../components/approval_cards/LiquidityApproveAndStake';
import LiquidityApproveAndUnstakeCard from '../../components/approval_cards/LiquidityApproveAndUnstakeCard';

import { toWei } from 'web3-utils';

const Liquidity: NextPage = () => {
    const [mounted, setMounted] = React.useState(false);
    const [reservesProphet, setReservesProphet] = React.useState(0n);
    const [reservesEth, setReservesEth] = React.useState(0n);

    const { address, isConnected } = useAccount();

    React.useEffect(() => setMounted(true), []);

    // contract config objects
    const pairContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_POOL_ADDRESS as '0x${string}',
        abi: pair_abi
    } as const;

    //// READ OPERATIONS
    const { data: reserves } = useReadContract({
        ...pairContractConfig,
        functionName: 'getReserves',
    });

    React.useEffect(() => {
        if (reserves) {
            // TODO - check if amount comes in as WEI
            // setEthAmountToAdd(BigInt(toWei(Number(ethAmount), "wei")));
            setReservesEth(reserves[0])
            setReservesProphet(reserves[1]);
        }
    }, [reserves]);

    //// STATE UPDATES

    // TODO - make NFTS populate iteratively and fix the always minting forever bug
    // TODO - make unstake flip the card and have the unstake button on the back
    // BigInt(toWei(Number(ethAmount), "wei"))

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <Typography className="container" variant="h2">Liquidity Zone</Typography>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <LiquidityCard mounted={mounted} isConnected={isConnected} cardTitle={"Provide Liquidity"}></LiquidityCard>
            </div>
            <div className='container'>
                <RemoveLiquidityCard mounted={mounted} isConnected={isConnected} cardTitle={"Remove Liquidity"}></RemoveLiquidityCard>
            </div>
            <div className="container" style={{ marginTop: "20px" }}>
                <Typography variant="h3">Staking</Typography>
            </div>
            <div className='container'>
                <LiquidityApproveAndStakeCard mounted={mounted} isConnected={isConnected} cardTitle={"Stake Liquidity"}></LiquidityApproveAndStakeCard>
            </div>
            <div className='container'>
                <LiquidityApproveAndUnstakeCard mounted={mounted} isConnected={isConnected} cardTitle={"Unstake Liquidity"}></LiquidityApproveAndUnstakeCard>
            </div>
        </div>
    );
};

// <LiquidityCard mounted={mounted} isConnected={isConnected} cardTitle={"Provide Liquidity"} setReservesEthParent={setReservesEth} setReservesProphetParent={setReservesProphet}></LiquidityCard>
// TODO - make it so staked NFTs use the flip card with unstake on it
// TODO - disable the stake button as well!

export default Liquidity;
