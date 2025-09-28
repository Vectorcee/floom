import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloomHeader } from "@/components/FloomHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Plus,
  Send,
  Download,
  RefreshCw
} from "lucide-react";
import tokenIcon from "@/assets/token-icon.jpg";

export default function Wallet() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20">
      <FloomHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading mb-2">My Wallet</h1>
            <p className="text-muted-foreground font-body">
              Manage your FUUM Points and tokens
            </p>
          </div>

          {/* Wallet Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* FUUM Points */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading flex items-center gap-2">
                    <img src={tokenIcon} alt="FUUM Points" className="h-6 w-6" />
                    FUUM Points (FP)
                  </CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading mb-2">0 FP</div>
                <p className="text-muted-foreground font-body text-sm mb-4">
                  Earned through hosting and participating in spaces
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button size="sm" className="w-full text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Earn More
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Send className="h-3 w-3 mr-1" />
                    Transfer
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Swap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* $FUUM Token */}
            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    $FUUM Token
                  </CardTitle>
                  <Badge variant="secondary" className="bg-secondary/20">
                    Coming Soon
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading mb-2 text-muted-foreground">-- $FUUM</div>
                <p className="text-muted-foreground font-body text-sm mb-4">
                  The official FUUM token for governance and rewards
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="w-full" disabled>
                    <Download className="h-4 w-4 mr-1" />
                    Buy
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <WalletIcon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-heading">Wallet Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-body mb-4">
                  Connect and manage your Web3 wallet
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-heading">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-body mb-4">
                  Add credit cards and payment options
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-heading">Staking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-body mb-4">
                  Stake your FUUM tokens for rewards
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Banner */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <WalletIcon className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-heading mb-4">Full Wallet Features Coming Soon</h2>
              <p className="text-muted-foreground font-body max-w-md mx-auto">
                We're building comprehensive wallet functionality including token swaps, 
                DeFi integrations, and cross-chain support.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}