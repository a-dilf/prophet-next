// next and react imports
import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';

import styles from '../styles/Nfts.module.css';

import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, Box } from '@mui/material';

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

    //// READ OPERATIONS
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


    //// STATE UPDATES
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

    // state management for user to select number of NFTs to mint
    const incrementCount = () => {
        setMintCount(mintCount + 1);
    };

    const decrementCount = () => {
        if (mintCount > 1) {
            setMintCount(mintCount - 1);
        }
    };

    const tokenId = 0

    // TODO - make NFTS populate iteratively and fix the always minting forever bug
    // TODO - make unstake flip the card and have the unstake button on the back

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <Typography className="container" variant="h2">NFT Zone</Typography>
            <div className='container'>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>NFTs in circulation:</TableCell>
                                <TableCell>{Number(totalMinted)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total level 5NFTs staked:</TableCell>
                                <TableCell>{Number(totalStakedState)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Level 5 NFTs staked by 0x{String(address).slice(-4)}:</TableCell>
                                <TableCell>{Number(userStakedState)}</TableCell>
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
                        <DecrementIcon />
                    </IconButton>
                    <span>{mintCount}</span>
                    <IconButton onClick={incrementCount}>
                        <IncrementIcon />
                    </IconButton>
                </Box>
            </div>
            <NftApproveAndActionCard mounted={mounted} isConnected={isConnected} cardTitle={"Approve burning $PROPHET"} amountToApprove={(Number(toWei(mintCount, "ether")) * 400000.01)} allowanceAmount={Number(currentAllowanceState)} mintCount={mintCount} totalMinted={totalMinted} setTotalMinted={setTotalMinted} setOwnedNftCardProps={setOwnedNftCardProps} setStateAllowanceAmount={setStateAllowanceAmount}></NftApproveAndActionCard>
            <Typography className="container" variant="h3">NFTs at 0x{String(address).slice(-4)}</Typography>
            {ownedNftCardProps.map((cardData, index) => (
                <NftCard
                    key={index}
                    mounted={cardData.mounted}
                    isConnected={cardData.isConnected}
                    tokenId={cardData.tokenId}
                    currentAllowanceState={cardData.currentAllowanceState}
                    setStateAllowanceAmount={cardData.setStateAllowanceAmount}
                />
            ))}
        </div>
    );
};

// TODO - make it so staked NFTs use the flip card with unstake on it
// TODO - disable the stake button as well!

export default Nfts;
