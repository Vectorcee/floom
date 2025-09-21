import * as React from 'react';
import { WagmiProvider, createConfig } from 'wagmi';
import { http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <OnchainKitProvider chain={base}>
          {children}
        </OnchainKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}