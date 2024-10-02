// next and react imports
import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';

import styles from '../styles/Nfts.module.css';

import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Box } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import IncrementIcon from '@mui/icons-material/Add'; // Import Add Icon
import DecrementIcon from '@mui/icons-material/Remove'; // Import Remove Icon

// rainbowkit+ imports
import {
    useAccount,
    useReadContract,
} from 'wagmi';

// abi objects
import { nft_abi } from '../../abi_objects/nft_abi';
import { token_abi } from '../../abi_objects/token_abi';
import { staking_nft_abi } from '../../abi_objects/staking_nft_abi';
import { usd_abi } from 'abi_objects/usd_abi';
import { pair_abi } from 'abi_objects/pair_abi';

// component imports
import NftCard from '../../components/cards/NftCard';
import NftApproveAndActionCard from '../../components/approval_cards/NftApproveAndActionCard';

import { toWei } from 'web3-utils';

const Nfts: NextPage = () => {
    const [totalMinted, setTotalMinted] = React.useState(0n);
    const [totalStakedState, setTotalStakedState] = React.useState(0n);
    const [userStakedState, setUserStakedState] = React.useState(0n);
    const [mounted, setMounted] = React.useState(false);
    const [hasRenderedOnce, setHasRenderedOnce] = React.useState(false);
    const [mintCount, setMintCount] = React.useState(1);
    const [currentAllowanceState, setStateAllowanceAmount] = React.useState(0n);
    const [ownedNftCardProps, setOwnedNftCardProps] = React.useState(new Array);
    const [currentTokenBalanceState, setCurrentTokenBalanceState] = React.useState(0n);
    const [ethInUSD, setEthInUSD] = React.useState(0);
    const [reservesProphet, setReservesProphet] = React.useState(0);
    const [reservesEth, setReservesEth] = React.useState(0);

    const { address, isConnected } = useAccount();

    React.useEffect(() => setMounted(true), []);

    // contract config objects
    const nftContractConfig = {
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}',
        abi: nft_abi
    } as const;

    const nftOwnerContractConfig = {
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}',
        abi: nft_abi,
        args: [address as '0x${string}']
    } as const;

    const allowanceContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [address as '0x${string}', process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}']
    } as const;

    const totalStakedContractConfig = {
        address: process.env.NEXT_PUBLIC_NFT_STAKING_ADDRESS as '0x${string}',
        abi: staking_nft_abi,
        functionName: "stakedCount"
    } as const;

    const userStakedContractConfig = {
        address: process.env.NEXT_PUBLIC_NFT_STAKING_ADDRESS as '0x${string}',
        abi: staking_nft_abi,
        args: [address as '0x${string}'],
        functionName: "userInfo"
    } as const;

    const balanceOfContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [address as '0x${string}'],
        functionName: 'balanceOf',
    } as const;

     // contract config objects
     const usdcPairContractConfig = {
        address: "0xC6962004f452bE9203591991D15f6b388e09E8D0",
        abi: usd_abi
    } as const;

    const pairContractConfig = {
        address: process.env.NEXT_PUBLIC_LP_POOL_ADDRESS as '0x${string}',
        abi: pair_abi
    } as const;

    //// READ OPERATIONS
    const { data: reserves } = useReadContract({
        ...pairContractConfig,
        functionName: 'getReserves',
    });

    const { data: currentBalance } = useReadContract({
        ...balanceOfContractConfig,
    });

    const { data: ownedNfts } = useReadContract({
        ...nftOwnerContractConfig,
        functionName: 'tokensOfOwner',
    });

    const { data: totalSupplyData } = useReadContract({
        ...nftContractConfig,
        functionName: 'totalSupply',
    });

    const { data: allowanceAmount } = useReadContract({
        ...allowanceContractConfig,
        functionName: "allowance"
    });

    const { data: totalStaked } = useReadContract({
        ...totalStakedContractConfig,
    });

    const { data: userStaked } = useReadContract({
        ...userStakedContractConfig,
    });

    const { data: usd_price } = useReadContract({
        ...usdcPairContractConfig,
        functionName: 'slot0',
    });

    //// STATE UPDATES
    React.useEffect(() => {
        if (reserves) {
            // TODO - check if amount comes in as WEI
            // setEthAmountToAdd(BigInt(toWei(Number(ethAmount), "wei")));
            const reserves0_wei = Number(reserves[0]) / 1000000000000000000
            const reserves1_wei = Number(reserves[1]) / 1000000000000000000
            
            console.log("reserves ", reserves[0], reserves[1])
            console.log("reserves ", reserves0_wei / reserves1_wei)
            console.log("reserves ", reserves1_wei / reserves0_wei)
            console.log("USD cost basis ", (reserves0_wei / reserves1_wei) * ethInUSD)

            setReservesEth(reserves0_wei)
            setReservesProphet(reserves1_wei);
        }
    }, [reserves]);

    React.useEffect(() => {
        if (usd_price) {
            const price = (Number(usd_price[0]) * Number(usd_price[0]) * (10**18) / (2**192));
            console.log("USD: ", usd_price[0], price / 1000000)
            setEthInUSD(price / 1000000)
        }
    }, [usd_price]);

    // update state with the read results
    React.useEffect(() => {
        if (ownedNfts && currentAllowanceState >= 0) {

            const nftCardsData = ownedNfts.map(tokenId => ({
                mounted: mounted, // Example value, replace with actual logic if needed
                isConnected: isConnected, // Example value, replace with actual logic if needed
                tokenId,
                nftContractConfig: nftContractConfig, // Example value, replace with actual logic if needed
                currentAllowanceState: currentAllowanceState,
                setStateAllowanceAmount: setStateAllowanceAmount
            }));

            setOwnedNftCardProps(nftCardsData)
        }
    }, [ownedNfts, currentAllowanceState]);

    console.log("current allowance: ", currentAllowanceState)

    React.useEffect(() => {
        if (totalSupplyData) {
            setTotalMinted(totalSupplyData);
        }
    }, [totalSupplyData]);

    React.useEffect(() => {
        if (totalStaked) {
            setTotalStakedState(totalStaked);
        }
    }, [totalStaked]);

    React.useEffect(() => {
        if (userStaked) {
            setUserStakedState(userStaked[0]);
        }
    }, [userStaked]);

    // update state with the read results
    React.useEffect(() => {
        if (allowanceAmount && !hasRenderedOnce) {
            setStateAllowanceAmount(allowanceAmount);
            setHasRenderedOnce(true);
            console.log("parent action")
        }
    }, [allowanceAmount, hasRenderedOnce]);

    React.useEffect(() => {
        if (currentBalance) {
            setCurrentTokenBalanceState(currentBalance);
        }
    }, [currentBalance]);

    // state management for user to select number of NFTs to mint
    const incrementCount = () => {
        setMintCount(mintCount + 1);
    };

    const decrementCount = () => {
        if (mintCount > 1) {
            setMintCount(mintCount - 1);
        }
    };

    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 10;

    const displayedCards = ownedNftCardProps.slice(
        currentPage * cardsPerPage,
        (currentPage + 1) * cardsPerPage
    );

    const loadNextCards = () => {
        if ((currentPage + 1) * cardsPerPage < ownedNftCardProps.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const loadPreviousCards = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // TODO - make NFTS populate iteratively and fix the always minting forever bug
    // TODO - make unstake flip the card and have the unstake button on the bac
    
    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <div className="nfttop">
                <Typography className="container" variant="h2">NFT Zone</Typography>
                <div className='container'>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={styles.table}>NFTs in circulation:</TableCell>
                                    <TableCell className={styles.table}>{Number(totalMinted)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={styles.table}>APR for NFT staking</TableCell>
                                    <TableCell className={styles.table}>{((1 / Number(totalStakedState) * 7500000 * 365 * ((reservesEth / reservesProphet) * ethInUSD) / 25) * 100)}%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={styles.table}>Total level 5NFTs staked:</TableCell>
                                    <TableCell className={styles.table}>{Number(totalStakedState)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={styles.table}>Level 5 NFTs staked by 0x{String(address).slice(-4)}:</TableCell>
                                    <TableCell className={styles.table}>{Number(userStakedState)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={styles.table}>$PROPHET tokens owned 0x{String(address).slice(-4)}:</TableCell>
                                    <TableCell className={styles.table}>{Math.floor(Number(toWei(Number(currentTokenBalanceState), "wei")) / 1000000000000000000)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className='container'>
                    <Typography variant="h3" sx={{ marginTop: "12px" }}>Approve and Mint</Typography>
                </div>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <Typography>Number of NFTS to mint and/or level up: </Typography>
                    <Box sx={{ border: '1px solid', borderColor: 'secondary.main', borderRadius: '4px', p: 1 }}>
                        <IconButton onClick={decrementCount}>
                            <DecrementIcon className={styles.symbol} />
                        </IconButton>
                        <span>{mintCount}</span>
                        <IconButton onClick={incrementCount}>
                            <IncrementIcon className={styles.symbol} />
                        </IconButton>
                    </Box>
                </div>
            </div>
            <NftApproveAndActionCard mounted={mounted} isConnected={isConnected} cardTitle={"Approve burning $PROPHET"} amountToApprove={(Number(toWei(mintCount, "ether")) * 400000.01)} allowanceAmount={Number(currentAllowanceState)} mintCount={mintCount} totalMinted={totalMinted} setTotalMinted={setTotalMinted} setOwnedNftCardProps={setOwnedNftCardProps} setStateAllowanceAmount={setStateAllowanceAmount}></NftApproveAndActionCard>
            <Typography className="container" variant="h3">NFTs at 0x{String(address).slice(-4)}</Typography>
            <div>
                <Button
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: 24, marginLeft: 15 }}
                    onClick={loadPreviousCards} 
                    disabled={currentPage === 0}
                >
                    Previous 10
                </Button>
                <Button
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: 24, marginLeft: 15 }}
                    onClick={loadNextCards}
                    disabled={(currentPage + 1) * cardsPerPage >= ownedNftCardProps.length}
                >
                    Next 10
                </Button>
            </div>
            {displayedCards.map((cardData, index) => (
                <NftCard
                    key={index}
                    mounted={cardData.mounted}
                    isConnected={cardData.isConnected}
                    tokenId={cardData.tokenId}
                    currentAllowanceState={cardData.currentAllowanceState}
                    setStateAllowanceAmount={cardData.setStateAllowanceAmount}
                />
            ))}
            <div>
                <Button
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: 24, marginLeft: 15 }}
                    onClick={loadPreviousCards} 
                    disabled={currentPage === 0}
                >
                    Previous 10
                </Button>
                <Button
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: 24, marginLeft: 15 }}
                    onClick={loadNextCards}
                    disabled={(currentPage + 1) * cardsPerPage >= ownedNftCardProps.length}
                >
                    Next 10
                </Button>
            </div>
        </div>
    );
};

// TODO - make it so staked NFTs use the flip card with unstake on it
// TODO - disable the stake button as well!
/*
<div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <Typography>Number of NFTS to mint and/or level up: </Typography>
                <Box sx={{ border: '1px solid', borderColor: 'secondary.main', borderRadius: '4px', p: 1 }}>
                    <IconButton onClick={decrementCount}>
                        <DecrementIcon />
                    </IconButton>
                    <span>{mintCount}</span>
                    <IconButton onClick={incrementCount}>
                        <IncrementIcon />
                    </IconButton>
                </Box>
            </div>
*/

export default Nfts;
