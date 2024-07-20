import '../styles/global.css';

import '@rainbow-me/rainbowkit/styles.css';
import React from "react";
import type { AppProps } from 'next/app';

import { ThemeProvider } from '@mui/material/styles';
import theme from '../styles/theme'; // Adjust the path according to your file structure

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { config } from '../wagmi';

import Layout from '../../components/Layout';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider theme={theme}>
            <Layout>
              <Component {...pageProps} /> 
            </Layout>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
