// next and react imports
import React from 'react';
import type { NextPage } from 'next';

import styles from '../styles/Liquidity.module.css';

import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

// rainbowkit+ imports
import {
    useAccount,
    useReadContract,
} from 'wagmi';

// abi objects
import { pair_abi } from '../../abi_objects/pair_abi';
import { staking_lp_abi } from '../../abi_objects/staking_lp_abi';

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
    const [userLPTBalanceState, setUserLPTBalanceState] = React.useState(0n);
    const [currentlyStakedTokens, setCurrentlyStakedTokens] = React.useState(0n);
    const [totalStakedTokens, setTotalStakedTokens] = React.useState(0n);

    const { address, isConnected } = useAccount();

    React.useEffect(() => setMounted(true), []);

    // contract config objects
    const pairContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_POOL_ADDRESS as '0x${string}',
        abi: pair_abi
    } as const;

    const tokenBalanceOfContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_POOL_ADDRESS as '0x${string}',
        abi: pair_abi,
        args: [address as '0x${string}'],
        functionName: "balanceOf"
    } as const;

    const stakingBalanceOfContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_STAKING_ADDRESS as '0x${string}',
        abi: staking_lp_abi,
        args: [address as '0x${string}'],
        functionName: "userInfo"
    } as const;

    const totalStakingBalanceOfContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_STAKING_ADDRESS as '0x${string}',
        abi: staking_lp_abi,
        functionName: "poolInfo"
    } as const;

    //// READ OPERATIONS
    const { data: reserves } = useReadContract({
        ...pairContractConfig,
        functionName: 'getReserves',
    });

    const { data: userBalance } = useReadContract({
        ...tokenBalanceOfContractConfig,
    });

    const { data: stakingBalance } = useReadContract({
        ...stakingBalanceOfContractConfig,
    });

    const { data: totalStakingBalance } = useReadContract({
        ...totalStakingBalanceOfContractConfig,
    });

    React.useEffect(() => {
        if (reserves) {
            // TODO - check if amount comes in as WEI
            // setEthAmountToAdd(BigInt(toWei(Number(ethAmount), "wei")));
            setReservesEth(reserves[0])
            setReservesProphet(reserves[1]);
        }
    }, [reserves]);

    React.useEffect(() => {
        if (userBalance) {
            // TODO - check if amount comes in as WEI
            // Math.floor(Number(toWei(Number(userBalance), "wei")) / 1000000000000000000)
            const userAmountInWei = BigInt(toWei(Number(userBalance), "wei"))
            console.log("aount: ", userAmountInWei)
            // setUserLPTBalanceState(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
            setUserLPTBalanceState(BigInt(userBalance));
        }
    }, [userBalance]);

    React.useEffect(() => {
        if (stakingBalance) {
            // TODO - check if amount comes in as WEI
            // Math.floor(Number(toWei(Number(userBalance), "wei")) / 1000000000000000000)
            // settokenAmountToRemove(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
            const userAmountInWei = BigInt(toWei(Number(stakingBalance[0]), "wei"))
            setCurrentlyStakedTokens(BigInt( BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000))))
        }
    }, [stakingBalance]);

    React.useEffect(() => {
        if (totalStakingBalance) {
            // TODO - check if amount comes in as WEI
            // Math.floor(Number(toWei(Number(userBalance), "wei")) / 1000000000000000000)
            // settokenAmountToRemove(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
            const totalStakeAmountInWei = BigInt(toWei(Number(totalStakingBalance[0]), "wei"))
            // setTotalStakedTokens(BigInt( BigInt(Math.floor(Number(totalStakeAmountInWei) / 1000000000000000000))))
            setTotalStakedTokens(BigInt(totalStakeAmountInWei))
        }
    }, [totalStakingBalance]);

    //// STATE UPDATES

    // TODO - make NFTS populate iteratively and fix the always minting forever bug
    // TODO - make unstake flip the card and have the unstake button on the back
    // BigInt(toWei(Number(ethAmount), "wei"))

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <Typography className="container" variant="h2">Liquidity Zone</Typography>
            <div className='container'>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Current pool ratio:</TableCell>
                                <TableCell>{Math.floor(Number(toWei(Number(reservesProphet), "wei")) / 1000000000000000000)} $PROPHET to {Number(toWei(Number(reservesEth), "wei")) / 1000000000000000000} ETH</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Liquidity tokens owned by 0x{String(address).slice(-4)}:</TableCell>
                                <TableCell>{Math.floor(Number(toWei(Number(userLPTBalanceState), "wei")) / 1000000000000000000)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total liquidity tokens staked:</TableCell>
                                <TableCell>{Number(totalStakedTokens)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Liquidity tokens staked by 0x{String(address).slice(-4)}:</TableCell>
                                <TableCell>{Number(currentlyStakedTokens)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className='container'>
                <Typography sx={{ paddingTop: "15px" }}>Contribute liquidity to the uniswap pool in the form of a pegged $PROPHET:ETH pair to earn UNI-V2 liquidity tokens.</Typography>
                <Typography sx={{ paddingTop: "15px" }}>Stake UNI-V2 liquidity tokens to earn a percentage of the daily 7,500,000 $PROPHET reward pool!</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <LiquidityCard mounted={mounted} isConnected={isConnected} cardTitle={"Provide Liquidity"}></LiquidityCard>
            </div>
            <div>
                <RemoveLiquidityCard mounted={mounted} isConnected={isConnected} cardTitle={"Remove Liquidity"}></RemoveLiquidityCard>
            </div>
            <div className="container" style={{ marginTop: "20px" }}>
                <Typography variant="h3">Staking</Typography>
            </div>
            <div>
                <LiquidityApproveAndStakeCard mounted={mounted} isConnected={isConnected} cardTitle={"Stake Liquidity"}></LiquidityApproveAndStakeCard>
            </div>
            <div>
                <LiquidityApproveAndUnstakeCard mounted={mounted} isConnected={isConnected} cardTitle={"Unstake Liquidity"}></LiquidityApproveAndUnstakeCard>
            </div>
        </div>
    );
};

// <LiquidityCard mounted={mounted} isConnected={isConnected} cardTitle={"Provide Liquidity"} setReservesEthParent={setReservesEth} setReservesProphetParent={setReservesProphet}></LiquidityCard>
// TODO - make it so staked NFTs use the flip card with unstake on it
// TODO - disable the stake button as well!

export default Liquidity;
