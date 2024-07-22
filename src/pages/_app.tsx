import "../styles/global.css";

import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme"; // Adjust the path according to your file structure

import { midnightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { config } from "../wagmi";

import Layout from "../../components/Layout";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={midnightTheme({ ...midnightTheme.accentColors.pink, borderRadius: "small", fontStack: "system" })}
        >
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
