import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { getDefaultWallets, RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {  configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, sepolia, hardhat, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { infuraProvider } from '@wagmi/core/providers/infura'

import {
    injectedWallet,
    rainbowWallet,
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
    ledgerWallet,
    argentWallet,
    trustWallet
} from '@rainbow-me/rainbowkit/wallets';

import { VotingProvider } from '@/providers/VotingProvider';

// wagmi config
const { chains, publicClient } = configureChains(
    [mainnet, sepolia, polygon, polygonMumbai, hardhat],
    [
        publicProvider(),
        infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID })
    ]
);

const { wallets } = getDefaultWallets({
    appName: process.env.NEXT_PUBLIC_WALLET_CONNECT_APPNAME,
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    chains,
});

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Others',
        wallets: [
            ledgerWallet({
                projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
                chains
            }),
            argentWallet({
                projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
                chains
            }),
            trustWallet({
                projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
                chains
            })
        ],
    },
])

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
});

export default function App({ Component, pageProps }) {
    // For load rainbowkit, ... only front
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), [])

    return (
        <ChakraProvider>
            {mounted && (
                <WagmiConfig config={wagmiConfig}>
                    <RainbowKitProvider chains={chains}>
                            <VotingProvider>
                                <Component {...pageProps} />
                            </VotingProvider>
                    </RainbowKitProvider>
                </WagmiConfig>
            )}
        </ChakraProvider>
    )
}
