"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  connectorsForWallets,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  coreWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { getConfig } from "./wagmi";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [rainbowWallet, metaMaskWallet],
    },
    {
      groupName: "Other",
      wallets: [coreWallet],
    },
  ],
  {
    projectId: "YOUR_PROJECT_ID",
    appName: "My Payment Escrow App",
  }
);

export default function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig(connectors));
  const [queryClient] = useState(() => new QueryClient());

  const selectedTheme = lightTheme({
    borderRadius: "small",
    fontStack: "system",
    overlayBlur: "small",
  });

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={11155111}
          // theme={selectedTheme}
          coolMode
          modalSize="wide"
          theme={darkTheme({
            accentColor: "#1c632f",
            accentColorForeground: "white",
            borderRadius: "small",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {props.children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
