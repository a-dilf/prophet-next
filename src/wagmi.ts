import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Prophet Lady Web Application',
  projectId: 'YOUR_PROJECT_ID',
  chains: [arbitrum],
  ssr: true,
});
