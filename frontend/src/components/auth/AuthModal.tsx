import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Twitter, Chrome, Globe, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signInWithProvider, signUp, signIn } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleProviderSignIn = async (provider: string) => {
    setLoading(provider);
    setError(null);
    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        console.error(`${provider} sign in error:`, error);
        setError(`Failed to sign in with ${provider}. Please ensure the provider is enabled in your Supabase project.`);
      } else {
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setError(`Failed to sign in with ${provider}. Please try again later.`);
    } finally {
      setLoading(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(null);
      return;
    }

    try {
      const { error } = mode === 'signup' 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        onOpenChange(false);
        resetForm();
        if (mode === 'signup') {
          alert('Please check your email to confirm your account!');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(null);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setMode('signin');
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-heading">
            {mode === 'signin' ? 'Sign In to Floom' : 'Create Your Floom Account'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-body">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading === 'email'}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-body">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading === 'email'}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full h-12"
              disabled={loading === 'email'}
            >
              {loading === 'email' ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-floom-accent hover:underline font-body"
                disabled={!!loading}
              >
                {mode === 'signin' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-body">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <Button
            onClick={() => handleProviderSignIn('google')}
            variant="outline"
            className="w-full flex items-center gap-3 h-12"
            disabled={!!loading}
          >
            <Chrome size={20} />
            Google
          </Button>

          <Button
            onClick={() => handleProviderSignIn('farcaster')}
            variant="outline"
            className="w-full flex items-center gap-3 h-12"
            disabled={!!loading}
          >
            <Globe size={20} />
            Farcaster
          </Button>

          <Button
            onClick={() => handleProviderSignIn('twitter')}
            variant="outline" 
            className="w-full flex items-center gap-3 h-12"
            disabled={!!loading}
          >
            <Twitter size={20} />
            X (Twitter)
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-body">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground text-center font-body">Connect your wallet</div>
            <div className="flex justify-center">
              <ConnectWallet />
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center font-body">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}