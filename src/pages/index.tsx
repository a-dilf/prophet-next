// next and react imports
import React from 'react';
import Image from 'next/legacy/image';
import type { NextPage } from 'next';
import { nft_contract_address } from '../../frontend_meta_data.json'
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemText, ListItemButton, Grid, Button } from '@mui/material';

// rainbowkit+ imports
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

// abi objects
import nft_abi from '../../abi_objects/nft_abi.json';
import frontend_meta_data from '../../frontend_meta_data.json'

// component imports
import FlipCard, { BackCard, FrontCard } from '../../components/FlipCard';
import NftCard from '../../components/NftCard';

const nftContractConfig = {
  address: frontend_meta_data["nft_contract_address"] as `0x${string}`,
  abi: nft_abi["abi"]
} as const;

const nftMintConfig = {
  address: frontend_meta_data["nft_contract_address"] as `0x${string}`,
  abi: nft_abi["abi"],
  args: [1]
} as const;

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [totalMinted, setTotalMinted] = React.useState(0n);
  const { isConnected } = useAccount();

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

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <Typography className="container" variant="h2">NFT Zone</Typography>
      <Typography className="container">NFTs in circulation: {Number(totalMinted)}</Typography>
      <div className="container">
        {mintError && (
          <p style={{ marginTop: 24, color: '#FF6257' }}>
            Error: {mintError.message}
          </p>
        )}
        {txError && (
          <p style={{ marginTop: 24, color: '#FF6257' }}>
            Error: {txError.message}
          </p>
        )}

        {mounted && isConnected && !isMinted && (
          <button
            style={{ marginTop: 24 }}
            disabled={!mint || isMintLoading || isMintStarted}
            className="button"
            data-mint-loading={isMintLoading}
            data-mint-started={isMintStarted}
            onClick={() =>
              mint?.({
                ...nftMintConfig,
                functionName: 'mint',
              })
            }
          >
            {isMintLoading && 'Waiting for approval'}
            {isMintStarted && 'Minting...'}
            {!isMintLoading && !isMintStarted && 'Approve and Mint'}
          </button>
        )}
      </div>
      <NftCard mounted={mounted} isConnected={isConnected} tokenId={tokenId} nftContractConfig={nftContractConfig}></NftCard>
    </div>
  );
};

export default Home;
