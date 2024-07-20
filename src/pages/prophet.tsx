// next and react imports
import React, { ChangeEvent } from 'react';
import type { NextPage } from 'next';
import styles from '../styles/Prophet.module.css';

import { TableHead, CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Button } from '@mui/material';
import ErrorAlert from '../../components/ErrorAlert';
import TextField from '@mui/material/TextField';

import { token_abi } from '../../abi_objects/token_abi';
import { staking_token_abi } from '../../abi_objects/staking_token_abi';
import { ido_vault_abi } from '../../abi_objects/ido_abi';

import { toWei } from 'web3-utils';

// rainbowkit+ imports
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useBalance
} from 'wagmi';

import ProphetApproveAndStakeCard from '../../components/approval_cards/ProphetApproveAndStake';
import ProphetApproveAndUnstakeCard from '../../components/approval_cards/ProphetApproveAndUnstakeCard';

const Prophet: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  const [currentTokenBalanceState, setCurrentTokenBalanceState] = React.useState(0n);
  const [currentETHBalanceState, setCurrentETHBalanceState] = React.useState(0n);
  const [ethToUseInBuyWei, setEthToUseInBuyWei] = React.useState(0n);
  const [ethToUseInBuyFloat, setEthToUseInBuyFloat] = React.useState(0);
  const [tokensThatCanBeBoughtWithCurrentEthState, setTokensThatCanBeBoughtWithCurrentEthState] = React.useState(0n);
  const [tokensRemaining, setTokensRemaining] = React.useState([0n]);
  const [userStakedTokensState, setUserStakedTokensState] = React.useState(0n)
  const [totalStakedTokensState, setTotalStakedTokensState] = React.useState(0n)
  const [maxApprovalAmount, setMaxApprovalAmount] = React.useState(0n)

  const { address, isConnected } = useAccount();

  const { data: currentEthBalance } = useBalance({
    address: address,
    unit: 'ether',
  });

  React.useEffect(() => setMounted(true), []);

  const balanceOfContractConfig = {
    address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
    abi: token_abi,
    args: [address as '0x${string}'],
    functionName: 'balanceOf',
  } as const;

  const buyTokensContractConfig = {
    address: process.env.NEXT_PUBLIC_IDO_ADDRESS as '0x${string}',
    abi: ido_vault_abi,
    args: [BigInt(tokensThatCanBeBoughtWithCurrentEthState)],
    value: BigInt(ethToUseInBuyWei),
    functionName: 'buy',
  } as const;

  const hardcoded_tier = 0
  const previewPurchaseContractConfig = {
    address: process.env.NEXT_PUBLIC_IDO_ADDRESS as '0x${string}',
    abi: ido_vault_abi,
    args: [ethToUseInBuyWei, BigInt(hardcoded_tier)],
    functionName: 'previewPurchase',
  } as const;

  const tokensRemainingContractConfig = {
    address: process.env.NEXT_PUBLIC_IDO_ADDRESS as '0x${string}',
    abi: ido_vault_abi,
    functionName: 'totalSold',
  } as const;

  const totalTokenStakingContractConfig = {
    address: process.env.NEXT_PUBLIC_TOKEN_STAKING_ADDRESS as '0x${string}',
    abi: staking_token_abi,
    functionName: 'totalStakedAmount'
  } as const;

  const userTokenStakingContractConfig = {
    address: process.env.NEXT_PUBLIC_TOKEN_STAKING_ADDRESS as '0x${string}',
    abi: staking_token_abi,
    args: [address as '0x${string}'],
    functionName: 'stakedAmounts'
  } as const;

  //// READ OPERATIONS
  const { data: currentBalance } = useReadContract({
    ...balanceOfContractConfig,
  });

  const { data: tokensThatCanBeBoughtWithCurrentEth } = useReadContract({
    ...balanceOfContractConfig,
  });

  const { data: tokenAmount } = useReadContract({
    ...previewPurchaseContractConfig,
  });

  const { data: tokensSold } = useReadContract({
    ...tokensRemainingContractConfig,
  });

  const { data: totalStakedProphet } = useReadContract({
    ...totalTokenStakingContractConfig,
  });

  const { data: userStakedProphet } = useReadContract({
    ...userTokenStakingContractConfig,
  });

  //// WRITE OPERATIONS
  // let user approve $PROPHET tokens
  const {
    data: hash,
    writeContract: buy,
    isPending: isBuyLoading,
    isSuccess: isBuyStarted,
    error: buyError,
  } = useWriteContract();

  // approve actions
  const {
    data: buyTxData,
    isSuccess: buyTxSuccess,
    error: buyTxError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  React.useEffect(() => {
    if (currentBalance) {
      setCurrentTokenBalanceState(currentBalance);
      setMaxApprovalAmount(currentBalance)
    }
  }, [currentBalance]);

  React.useEffect(() => {
    if (userStakedProphet) {
      setUserStakedTokensState(userStakedProphet[0]);
    }
  }, [userStakedProphet]);

  React.useEffect(() => {
    if (totalStakedProphet) {
      setTotalStakedTokensState(totalStakedProphet);
    }
  }, [totalStakedProphet]);

  React.useEffect(() => {
    if (tokenAmount) {
      setTokensThatCanBeBoughtWithCurrentEthState(tokenAmount);
    }
  }, [tokenAmount]);

  React.useEffect(() => {
    if (!isBuyLoading && isBuyStarted) {
      setCurrentTokenBalanceState(prevBalance => prevBalance + tokensThatCanBeBoughtWithCurrentEthState);

    }
  }, [isBuyLoading, isBuyStarted]);

  React.useEffect(() => {
    if (tokensSold) {
      let tokensLeftInVault = BigInt(120000000000) - (tokensSold / BigInt(1000000000000000000));

      const maxTokensPerVault = 20000000000
      let vaultIndex = 0;
      let vaults: bigint[] = [];

      while (tokensLeftInVault > 0) {
        let tokensToAdd = BigInt(Math.min(maxTokensPerVault, Number(tokensLeftInVault)));

        vaults[vaultIndex] = tokensToAdd;
        tokensLeftInVault -= tokensToAdd;
        vaultIndex++;
      }

      while (vaults.length < 6) {
        vaults.push(0n)
      }

      setTokensRemaining(vaults);
    }
  }, [tokensSold]);

  function toThreeSignificantFigures(num: number): number {
    // Calculate the factor needed to shift the decimal point
    let factor = Math.pow(10, Math.floor(Math.log10(Math.abs(num))) + (1 - 3));
    
    // Round the number to three significant figures
    let roundedNum = Math.round(num / factor) * factor;
  
    // Reduce the rounded number by 2%
    let adjustedRoundedNum = roundedNum * 0.98;
  
    // Convert to string, remove trailing digits beyond the third significant figure
    let str = adjustedRoundedNum.toString();
    // Match any characters after the third significant digit following the decimal point
    str = str.replace(/(\.\d{1,3})(\d+)/, '$1');
  
    return parseFloat(str);
  }

  React.useEffect(() => {
    if (currentEthBalance) {
      const converted_value = Number(currentEthBalance["value"]) / 1000000000000000000
      setEthToUseInBuyFloat(toThreeSignificantFigures(converted_value));

      /*
      const converted_value = Number(currentEthBalance["value"]) / 1000000000000000000
      const converted_value_with_removed_amount = converted_value * 98
      setEthToUseInBuyFloat(parseFloat(converted_value_with_removed_amount.toPrecision(7)));
      */
     
      const ethBalanceWithMinimumAmountRemoved = Number(currentEthBalance["value"]) * .97
      console.log(ethBalanceWithMinimumAmountRemoved)
      setEthToUseInBuyWei(BigInt(toWei(ethBalanceWithMinimumAmountRemoved, "wei")));
      
      setCurrentETHBalanceState(BigInt(toWei(currentEthBalance["value"], "wei")));
    }
  }, [currentEthBalance]);

  // TODO: make tier dynamic?
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEthToUseInBuyFloat(parseFloat(event.target.value));
    const ethInWei = BigInt(Number(event.target.value) * 1000000000000000000)
    setEthToUseInBuyWei(ethInWei)
    // setTokensThatCanBeBoughtWithCurrentEthState(BigInt(tokenAmount))
  };

      // error handling
      const [errorMessage, setErrorMessage] = React.useState('');

      React.useEffect(() => {
          if (buyError) {
              setErrorMessage(buyError["message"]);
              // setOpen(true);
          }
      }, [buyError]);
  
      React.useEffect(() => {
          if (buyTxError) {
              setErrorMessage(buyTxError["message"]);
              // setOpen(true);
          }
      }, [buyTxError]);

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
              <ErrorAlert errorMessage={errorMessage} setErrorMessage={setErrorMessage}></ErrorAlert>
      <div className="prophettop">
      <Typography className="container" variant="h2">$PROPHET Zone</Typography>
      <div className='container'>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={styles.table}>$PROPHET tokens owned by 0x{String(address).slice(-4)}:</TableCell>
                <TableCell className={styles.table}>{Math.floor(Number(toWei(Number(currentTokenBalanceState), "wei")) / 1000000000000000000)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>Total $PROPHET tokens staked:</TableCell>
                <TableCell className={styles.table}>{Number(totalStakedTokensState)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>$PROPHET staked by 0x{String(address).slice(-4)}:</TableCell>
                <TableCell className={styles.table}>{Number(userStakedTokensState)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="container">
        <Button
          color="secondary"
          variant="contained"
          style={{ marginTop: 24, marginLeft: 15 }}
          disabled={!buy || isBuyLoading || isBuyStarted}
          data-mint-started={isBuyLoading && !isBuyStarted}
          data-mint-complete={!isBuyLoading && isBuyStarted}
          onClick={() =>
            buy?.({
              ...buyTokensContractConfig,
            })
          }
        >
          {!isBuyLoading && !isBuyStarted && "BUY"}
          {isBuyLoading && 'Executing...'}
          {!isBuyLoading && isBuyStarted && "complete"}
        </Button>
        <TextField
          label="ETH Provided"
          type="number"
          value={ethToUseInBuyFloat}
          onChange={handleChange}
          style={{ marginTop: 15, marginLeft: 15 }}
        />
      </div>
      <div className='container'>
        <Typography>will result in approx. {Math.floor(Number(toWei(Number(tokensThatCanBeBoughtWithCurrentEthState), "wei")) / 1000000000000000000)} $PROPHET tokens!</Typography>
      </div>
      <div className='container'>
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: 24, marginLeft: 15 }}
          disabled={!buy || isBuyLoading || isBuyStarted}
          onClick={() => {
            setEthToUseInBuyFloat(0.1)
            setEthToUseInBuyWei(BigInt(0.1 * 1000000000000000000))
          }
          }
        >
          .1
        </Button>
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: 24, marginLeft: 15 }}
          disabled={!buy || isBuyLoading || isBuyStarted}
          onClick={() => {
            setEthToUseInBuyFloat(0.5)
            setEthToUseInBuyWei(BigInt(0.5 * 1000000000000000000))
          }
          }
        >
          .5
        </Button>
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: 24, marginLeft: 15 }}
          disabled={!buy || isBuyLoading || isBuyStarted}
          onClick={() => {
            setEthToUseInBuyFloat(1)
            setEthToUseInBuyWei(BigInt(1 * 1000000000000000000))
          }
          }
        >
          1
        </Button>
        <Button
          color="secondary"
          variant="contained"
          style={{ marginTop: 24, marginLeft: 15 }}
          disabled={!buy || isBuyLoading || isBuyStarted}
          onClick={() => {
            setEthToUseInBuyFloat(toThreeSignificantFigures(Number(currentETHBalanceState) / 1000000000000000000))
            setEthToUseInBuyWei(BigInt(Number(currentETHBalanceState) * .97))
          }
          }
        >
          MAX
        </Button>
      </div>
      </div>  
      <div className="container" style={{ marginTop: "20px" }}>
        <Typography variant="h3">Staking</Typography>
      </div>
      <div>
        <ProphetApproveAndStakeCard mounted={mounted} isConnected={isConnected} cardTitle='Stake $PROPHET' currentTokenBalanceState={currentTokenBalanceState} setCurrentTokenBalanceState={setCurrentTokenBalanceState} maxApprovalAmount={maxApprovalAmount}></ProphetApproveAndStakeCard>
        <ProphetApproveAndUnstakeCard mounted={mounted} isConnected={isConnected} cardTitle='Unstake $PROPHET' currentTokenBalanceState={currentTokenBalanceState} setCurrentTokenBalanceState={setCurrentTokenBalanceState}></ProphetApproveAndUnstakeCard>
      </div>
      <div className="container" style={{ marginTop: "20px" }}>
        <Typography variant="h3">Stages</Typography>
      </div>
      <div className="container">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={styles.table}>ETH per token</TableCell>
                <TableCell className={styles.table}>Tokens left</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className={styles.table}>.000000003125</TableCell>
                <TableCell className={styles.table}>{String(tokensRemaining[5])}</TableCell>
                <TableCell>
                  <CircularProgress color="secondary"
                    sx={{
                      height: 25, // Adjust the height as needed
                      width: '100%', // Make the bar wider
                    }} variant="determinate" value={(Number(tokensRemaining[5]) / 20000000000) * 100} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>.000000006250</TableCell>
                <TableCell className={styles.table}>{String(tokensRemaining[4])}</TableCell>
                <TableCell>
                  <CircularProgress color="secondary"
                    sx={{
                      height: 25, // Adjust the height as needed
                      width: '100%', // Make the bar wider
                    }} variant="determinate" value={(Number(tokensRemaining[4]) / 20000000000) * 100} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>.000000012500</TableCell>
                <TableCell className={styles.table}>{String(tokensRemaining[3])}</TableCell>
                <TableCell>
                  <CircularProgress color="secondary"
                    sx={{
                      height: 25, // Adjust the height as needed
                      width: '100%', // Make the bar wider
                    }} variant="determinate" value={(Number(tokensRemaining[3]) / 20000000000) * 100} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>.000000025000</TableCell>
                <TableCell className={styles.table}>{String(tokensRemaining[2])}</TableCell>
                <TableCell>
                  <CircularProgress color="secondary"
                    sx={{
                      height: 25, // Adjust the height as needed
                      width: '100%', // Make the bar wider
                    }} variant="determinate" value={(Number(tokensRemaining[2]) / 20000000000) * 100} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>.000000050000</TableCell>
                <TableCell className={styles.table}>{String(tokensRemaining[1])}</TableCell>
                <TableCell>
                  <CircularProgress color="secondary"
                    sx={{
                      height: 25, // Adjust the height as needed
                      width: '100%', // Make the bar wider
                    }} variant="determinate" value={(Number(tokensRemaining[1]) / 20000000000) * 100} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.table}>.000000100000</TableCell>
                <TableCell className={styles.table}>{String(tokensRemaining[0])}</TableCell>
                <TableCell>
                  <CircularProgress color="secondary"
                    sx={{
                      height: 25, // Adjust the height as needed
                      width: '100%', // Make the bar wider
                    }} variant="determinate" value={(Number(tokensRemaining[0]) / 20000000000) * 100} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Prophet;
