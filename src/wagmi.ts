import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { arbitrum } from 'wagmi/chains';
import { createConfig } from 'wagmi';
import { createClient, http } from 'viem'

import {
  walletConnectWallet,
  braveWallet, // Ensure all necessary imports are here
  metaMaskWallet,
  coinbaseWallet,
  rabbyWallet,
  okxWallet,
  bitgetWallet
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, rabbyWallet, coinbaseWallet, braveWallet, walletConnectWallet, okxWallet, bitgetWallet],
    },
  ],
  { appName: 'RainbowKit App', projectId: 'YOUR_PROJECT_ID' },
);

export const config = createConfig({
  connectors,
  chains: [arbitrum],
  ssr: true,
  client({ chain }) { 
    return createClient({ chain, transport: http() }) 
  }, 
});

