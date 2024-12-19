// next and react imports
import type { NextPage } from "next";
import React from "react";

import styles from "../styles/Liquidity.module.css";

import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

// rainbowkit+ imports
import { useAccount, useReadContract } from "wagmi";

// abi objects
import { lp_abi } from "abi_objects/lp_abi";
import { usd_abi } from "abi_objects/usd_abi";
import { pair_abi } from "../../abi_objects/pair_abi";
import { staking_lp_abi } from "../../abi_objects/staking_lp_abi";

// component imports
import LiquidityApproveAndStakeCard from "../../components/approval_cards/LiquidityApproveAndStake";
import LiquidityApproveAndUnstakeCard from "../../components/approval_cards/LiquidityApproveAndUnstakeCard";
import LiquidityCard from "../../components/cards/LiquidityCard";
import RemoveLiquidityCard from "../../components/cards/RemoveLiquidityCard";

import { toWei } from "web3-utils";

import BouncingCube from "components/BouncingCube";

const Liquidity: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  const [reservesProphet, setReservesProphet] = React.useState(0n);
  const [reservesEth, setReservesEth] = React.useState(0n);
  const [userLPTBalanceState, setUserLPTBalanceState] = React.useState(0n);
  const [userLPTBalanceStateDisplay, setUserLPTBalanceStateDisplay] = React.useState(0n);
  const [currentlyStakedTokens, setCurrentlyStakedTokens] = React.useState(0n);
  const [totalStakedTokens, setTotalStakedTokens] = React.useState(0n);
  const [ethInUSD, setEthInUSD] = React.useState(0);
  const [totalSupplyInPool, setTotalSupplyInPool] = React.useState(0);

  const { address, isConnected } = useAccount();

  React.useEffect(() => setMounted(true), []);

  // contract config objects
  const pairContractConfig = {
    address: process.env.NEXT_PUBLIC_LP_POOL_ADDRESS as "0x${string}",
    abi: pair_abi,
  } as const;

  // contract config objects
  const usdcPairContractConfig = {
    address: "0xC6962004f452bE9203591991D15f6b388e09E8D0",
    abi: usd_abi,
  } as const;

  const tokenBalanceOfContractConfig = {
    address: process.env.NEXT_PUBLIC_LP_POOL_ADDRESS as "0x${string}",
    abi: pair_abi,
    args: [address as "0x${string}"],
    functionName: "balanceOf",
  } as const;

  const stakingBalanceOfContractConfig = {
    address: process.env.NEXT_PUBLIC_LP_STAKING_ADDRESS as "0x${string}",
    abi: staking_lp_abi,
    args: [address as "0x${string}"],
    functionName: "userInfo",
  } as const;

  const totalStakingBalanceOfContractConfig = {
    address: process.env.NEXT_PUBLIC_LP_POOL_ADDRESS as "0x${string}",
    abi: lp_abi,
    args: [process.env.NEXT_PUBLIC_LP_STAKING_ADDRESS as "0x${string}"],
    functionName: "balanceOf",
  } as const;

  //  lpToken.balanceOf(LPFarm)

  //// READ OPERATIONS
  const { data: reserves } = useReadContract({
    ...pairContractConfig,
    functionName: "getReserves",
  });

  const { data: poolTotalSupply } = useReadContract({
    ...pairContractConfig,
    functionName: "totalSupply",
  });

  const { data: usd_price } = useReadContract({
    ...usdcPairContractConfig,
    functionName: "slot0",
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
      const reserves0_wei = Number(reserves[0]) / 1000000000000000000;
      const reserves1_wei = Number(reserves[1]) / 1000000000000000000;

      console.log("reserves ", reserves[0], reserves[1]);
      console.log("reserves ", reserves0_wei / reserves1_wei);
      console.log("reserves ", reserves1_wei / reserves0_wei);
      console.log("USD cost basis ", (reserves0_wei / reserves1_wei) * ethInUSD);

      setReservesEth(reserves[0]);
      setReservesProphet(reserves[1]);
    }
  }, [reserves]);

  React.useEffect(() => {
    if (poolTotalSupply) {
      setTotalSupplyInPool(Number(poolTotalSupply));
    }
  }, [poolTotalSupply]);

  React.useEffect(() => {
    if (userBalance) {
      // TODO - check if amount comes in as WEI
      // Math.floor(Number(toWei(Number(userBalance), "wei")) / 1000000000000000000)
      const userAmountInWei = BigInt(toWei(Number(userBalance), "wei"));
      console.log("aount: ", userAmountInWei);
      // setUserLPTBalanceState(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
      setUserLPTBalanceStateDisplay(BigInt(Number(userBalance) * 1000000000000000000));
      setUserLPTBalanceState(BigInt(userBalance));
    }
  }, [userBalance]);

  React.useEffect(() => {
    if (stakingBalance) {
      // TODO - check if amount comes in as WEI
      // Math.floor(Number(toWei(Number(userBalance), "wei")) / 1000000000000000000)
      // settokenAmountToRemove(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
      const userAmountInWei = BigInt(toWei(Number(stakingBalance[0]), "wei"));
      setCurrentlyStakedTokens(BigInt(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000))));
    }
  }, [stakingBalance]);

  React.useEffect(() => {
    if (totalStakingBalance) {
      // TODO - check if amount comes in as WEI
      // Math.floor(Number(toWei(Number(userBalance), "wei")) / 1000000000000000000)
      // settokenAmountToRemove(BigInt(Math.floor(Number(userAmountInWei) / 1000000000000000000)));
      // const totalStakeAmountInWei = BigInt(toWei(Number(totalStakingBalance), "wei") * 1000000000000000000)
      // setTotalStakedTokens(BigInt(BigInt(Math.floor(Number(totalStakingBalance) * 1000000000000000000))))
      setTotalStakedTokens(BigInt(Math.floor(Number(totalStakingBalance) / 1000000000000000000)));
    }
  }, [totalStakingBalance]);

  React.useEffect(() => {
    if (usd_price) {
      const price = (Number(usd_price[0]) * Number(usd_price[0]) * 10 ** 18) / 2 ** 192;
      // console.log("USD: ", usd_price[0], price / 1000000)
      setEthInUSD(price / 1000000);
    }
  }, [usd_price]);

  //// STATE UPDATES

  // TODO - make NFTS populate iteratively and fix the always minting forever bug
  // TODO - make unstake flip the card and have the unstake button on the back
  // BigInt(toWei(Number(ethAmount), "wei"))

  console.log("ETH required for 1 UNIv2 ", Number(reservesEth) / totalSupplyInPool);
  console.log("PROPHET required for 1 UNIv2 ", Number(reservesProphet) / totalSupplyInPool);
  console.log("total staked UNIv2 ", Number(totalStakedTokens));
  console.log("price of ETH ", Number(ethInUSD));
  console.log("ETH reserves ", Number(reservesEth));
  console.log("total supply ", Number(totalSupplyInPool));
  console.log("div ", Number(reservesEth) / Number(totalSupplyInPool));

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
      <div className="liquiditytop">
        <Typography className="container" variant="h2">
          Liquidity Zone
        </Typography>
        <div className="container">
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className={styles.table}>Current pool ratio:</TableCell>
                  <TableCell className={styles.table}>
                    {Math.floor(Number(toWei(Number(reservesProphet), "wei")) / 1000000000000000000)} $PROPHET to{" "}
                    {Number(toWei(Number(reservesEth), "wei")) / 1000000000000000000} ETH
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={styles.table}>APR for Liquidity staking:</TableCell>
                  <TableCell className={styles.table}>
                    {Math.floor(
                      ((1 / Number(totalStakedTokens)) *
                        7500000 *
                        365 *
                        ((Number(reservesEth) / totalSupplyInPool) * ethInUSD)) /
                        35
                    )}
                    %
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={styles.table}>
                    Liquidity tokens owned by 0x{String(address).slice(-4)}:
                  </TableCell>
                  <TableCell className={styles.table}>
                    {Math.floor(Number(toWei(Number(userLPTBalanceState), "wei")) / 1000000000000000000)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={styles.table}>Total liquidity tokens staked:</TableCell>
                  <TableCell className={styles.table}>{Math.floor(Number(totalStakedTokens))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={styles.table}>
                    Liquidity tokens staked by 0x{String(address).slice(-4)}:
                  </TableCell>
                  <TableCell className={styles.table}>{Math.floor(Number(currentlyStakedTokens))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <BouncingCube
          imagePaths={{
            right: "prophet_lady/6.avif",
            left: "prophet_lady/7.avif",
            top: "prophet_lady/8.avif",
            bottom: "prophet_lady/9.avif",
            front: "prophet_lady/10.avif",
            back: "prophet_lady/11.avif",
          }}
          width="100%"
          height="100%"
          rotation_x={0.005}
          rotation_y={0.005}
        />
      </div>
      <div className="container">
        <Typography sx={{ paddingTop: "15px" }}>
          Contribute liquidity to the uniswap pool in the form of a pegged $PROPHET:ETH pair to earn UNI-V2 liquidity
          tokens.
        </Typography>
        <Typography sx={{ paddingTop: "15px" }}>
          Stake UNI-V2 liquidity tokens to earn a percentage of the daily 7,500,000 $PROPHET reward pool!
        </Typography>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <LiquidityCard mounted={mounted} isConnected={isConnected} cardTitle={"Provide Liquidity"}></LiquidityCard>
      </div>
      <div>
        <RemoveLiquidityCard
          mounted={mounted}
          isConnected={isConnected}
          cardTitle={"Remove Liquidity"}
          currentLPBalance={userLPTBalanceState}
          setUserLPTBalanceState={setUserLPTBalanceState}
        ></RemoveLiquidityCard>
      </div>
      <div className="container" style={{ marginTop: "20px" }}>
        <Typography variant="h3">Staking</Typography>
      </div>
      <div>
        <LiquidityApproveAndStakeCard
          mounted={mounted}
          isConnected={isConnected}
          cardTitle={"Stake Liquidity"}
        ></LiquidityApproveAndStakeCard>
      </div>
      <div>
        <LiquidityApproveAndUnstakeCard
          mounted={mounted}
          isConnected={isConnected}
          cardTitle={"Unstake Liquidity"}
        ></LiquidityApproveAndUnstakeCard>
      </div>
    </div>
  );
};

// <LiquidityCard mounted={mounted} isConnected={isConnected} cardTitle={"Provide Liquidity"} setReservesEthParent={setReservesEth} setReservesProphetParent={setReservesProphet}></LiquidityCard>
// TODO - make it so staked NFTs use the flip card with unstake on it
// TODO - disable the stake button as well!

export default Liquidity;
