// next and react imports
import React from 'react';
import type { NextPage } from 'next';

import { Typography, Button, Box } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import IncrementIcon from '@mui/icons-material/Add'; // Import Add Icon
import DecrementIcon from '@mui/icons-material/Remove'; // Import Remove Icon

// rainbowkit+ imports
import {
    useAccount,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi';

// abi objects
import { nft_abi } from '../../abi_objects/nft_abi';
import { token_abi } from '../../abi_objects/token_abi';

// component imports
import NftCard from '../../components/NftCard';
import ApproveAndAction from '../../components/ApproveAndActionCard';

import { toWei } from 'web3-utils';


const Home: NextPage = () => {
    const [totalMinted, setTotalMinted] = React.useState(0n);
    const [mounted, setMounted] = React.useState(false);
    const [mintCount, setMintCount] = React.useState(1);
    const { address, isConnected } = useAccount();

    const [currentAllowance, setStateAllowanceAmount] = React.useState(0n);

    React.useEffect(() => setMounted(true), []);

    const nftContractConfig = {
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}',
        abi: nft_abi
    } as const;

    const nftMintConfig = {
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as '0x${string}',
        abi: nft_abi,
        args: [mintCount]
    } as const;

    const allowanceContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [address, process.env.NEXT_PUBLIC_NFT_ADDRESS]
    } as const;

    const approvingContractConfig = {
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as '0x${string}',
        abi: token_abi,
        args: [process.env.NEXT_PUBLIC_NFT_ADDRESS, Number(toWei(mintCount, "ether")) * 400000.01]
    } as const;

    //// READ OPERATIONS
    const { data: allowanceAmount } = useReadContract({
        ...allowanceContractConfig,
        functionName: "allowance"
    });

    // update state with the read results
    React.useEffect(() => {
        if (allowanceAmount) {
            setStateAllowanceAmount(allowanceAmount);
        }
    }, [allowanceAmount]);


    // Function to increment the count
    const incrementCount = () => {
        setMintCount(mintCount + 1);
    };

    // Function to decrement the count
    const decrementCount = () => {
        if (mintCount > 1) {
            setMintCount(mintCount - 1);
        }
    };

    const {
        data: hash,
        writeContract: mint,
        isPending: isMintLoading,
        isSuccess: isMintStarted,
        error: mintError,
    } = useWriteContract();

    const { data: totalSupplyData } = useReadContract({
        ...nftContractConfig,
        functionName: 'totalSupply',
    });

    const {
        data: txData,
        isSuccess: txSuccess,
        error: txError,
    } = useWaitForTransactionReceipt({
        hash,
        query: {
            enabled: !!hash,
        },
    });

    React.useEffect(() => {
        if (totalSupplyData) {
            setTotalMinted(totalSupplyData);
        }
    }, [totalSupplyData]);

    const isMinted = txSuccess;
    const tokenId = 0

    // TODO - make NFTS populate iteratively and fix the always minting forever bug
    // TODO - make unstake flip the card and have the unstake button on the back

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <Typography className="container" variant="h2">NFT Zone</Typography>
            <Typography className="container">NFTs in circulation: {Number(totalMinted)}</Typography>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <Typography>Number of NFTS to mint: </Typography>
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
            <ApproveAndAction mounted={mounted} isConnected={isConnected} cardTitle={"Approve and Mint"} actionContractConfig={nftMintConfig} allowanceAmount={currentAllowance} approvingContractConfig={approvingContractConfig} actionFunctionName={"mint"}></ApproveAndAction>
            <Typography className="container" variant="h3">NFTs at 0x{String(address).slice(-4)}</Typography>
            <NftCard mounted={mounted} isConnected={isConnected} tokenId={tokenId} nftContractConfig={nftContractConfig}></NftCard>
            <NftCard mounted={mounted} isConnected={isConnected} tokenId={9} nftContractConfig={nftContractConfig}></NftCard>
        </div>
    );
};

export default Home;
