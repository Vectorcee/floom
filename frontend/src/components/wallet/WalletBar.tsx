import { useAccount, useBalance } from 'wagmi';
import { base } from 'viem/chains';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

export default function WalletBar() {
  const { address, chainId, isConnected } = useAccount();
  const { data } = useBalance({
    address,
    chainId: base.id,
    query: { enabled: !!address }
  });

  return (
    <div className='w-full flex items-center justify-between rounded-lg border hairline bg-black/40 p-3 mb-4'>
      <div className='flex items-center gap-3'>
        <span className='text-white/70 text-sm'>Network:</span>
        <span className='text-white font-medium'>Base</span>
        {chainId && chainId !== base.id && (
          <span className='ml-3 text-xs text-red-400'>Switch to Base</span>
        )}
      </div>
      <div className='flex items-center gap-4'>
        {isConnected && (
          <div className='text-sm text-white/80'>
            {address?.slice(0,6)}…{address?.slice(-4)} · {data ? `${Number(data.formatted).toFixed(4)} ${data.symbol}` : '—'}
          </div>
        )}
        <ConnectWallet />
      </div>
    </div>
  );
}