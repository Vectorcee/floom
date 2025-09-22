import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Wallet, Twitter, Chrome, Globe } from 'lucide-react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signInWithProvider } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleProviderSignIn = async (provider: 'google' | 'twitter') => {
    setLoading(provider);
    const { error } = await signInWithProvider(provider);
    setLoading(null);
    
    if (!error) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-heading">
            Sign In to Floom
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <Button
            onClick={() => handleProviderSignIn('google')}
            variant="outline"
            className="w-full flex items-center gap-3 h-12"
            disabled={loading === 'google'}
          >
            <Chrome size={20} />
            {loading === 'google' ? 'Connecting...' : 'Continue with Google'}
          </Button>

          <Button
            onClick={() => handleProviderSignIn('twitter')}
            variant="outline" 
            className="w-full flex items-center gap-3 h-12"
            disabled={loading === 'twitter'}
          >
            <Twitter size={20} />
            {loading === 'twitter' ? 'Connecting...' : 'Continue with X (Twitter)'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground text-center">Connect your wallet</div>
            <div className="flex justify-center">
              <ConnectWallet />
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}