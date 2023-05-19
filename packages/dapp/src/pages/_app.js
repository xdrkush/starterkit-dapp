import { ChakraProvider } from '@chakra-ui/react'
import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, sepolia, hardhat, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

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

const { chains, publicClient } = configureChains(
    [mainnet, sepolia, polygon, polygonMumbai, hardhat],
    [
        publicProvider(),
        jsonRpcProvider({
            // Check if the chain ID matches the Polygon Mumbai test network
            rpc: (chain) => {
              if (chain.id !== polygonMumbai.id) return null;
              return { http: chain.rpcUrls.default };
            },
          }),
    ]
);

const projectId = "Sylver dApp";
const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            injectedWallet({ chains }),
            rainbowWallet({ projectId, chains }),
            metaMaskWallet({ projectId, chains }),
            coinbaseWallet({ chains, appName: projectId }),
            walletConnectWallet({ projectId, chains }),
        ],
    },
    {
        groupName: 'Others',
        wallets: [
            ledgerWallet({ projectId, chains }),
            argentWallet({ projectId, chains }),
            trustWallet({ projectId, chains })
        ],
    },
]);

const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

export default function App({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <WagmiConfig config={config}>
                <RainbowKitProvider chains={chains}>
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    )
}
