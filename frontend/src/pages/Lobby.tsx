import { Button } from "@/components/ui/button";
import { FloomHeader } from "@/components/FloomHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/AuthModal";
import { 
  Users, 
  Zap, 
  Star, 
  Plus, 
  CheckCircle, 
  Wallet, 
  TrendingUp, 
  Clock,
  MicIcon,
  ScanLine,
  Target,
  Headphones,
  Radio,
  Activity,
  Globe,
  Sparkles
} from "lucide-react";
import holographicGrid from "@/assets/holographic-grid.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: ScanLine,
    title: "Quality Conveyor",
    description: "A live feed of FAKE-approved posts streams into your Space."
  },
  {
    icon: Headphones,
    title: "Proof-of-Listen",
    description: "Lightweight participation checks ensure fair rewards."
  },
  {
    icon: MicIcon,
    title: "Speaker Bonuses",
    description: "Great speakers earn from host's share based on retention and impact."
  },
  {
    icon: Target,
    title: "Clip-to-Frame",
    description: "One-tap audio clips become Farcaster Frames for discovery."
  }
];

// Animated floating orbs component
const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl animate-pulse`}
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );
};

// Live activity indicators
const LiveActivityBadges = () => {
  const [activeSpaces, setActiveSpaces] = useState(12);
  const [onlineUsers, setOnlineUsers] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSpaces(prev => prev + Math.floor(Math.random() * 3 - 1));
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10 - 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <Radio className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{activeSpaces} Live Spaces</span>
      </div>
      <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-secondary/20">
        <Activity className="w-4 h-4 text-secondary" />
        <span className="text-sm font-medium">{onlineUsers.toLocaleString()} Online</span>
      </div>
      <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-accent/20">
        <Globe className="w-4 h-4 text-accent animate-spin" style={{animationDuration: '8s'}} />
        <span className="text-sm font-medium">Base Network</span>
      </div>
    </div>
  );
};

export default function Lobby() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleCreateSpace = () => {
    if (user) {
      navigate('/create');
    } else {
      // Show sign-in modal for unauthenticated users
      setAuthModalOpen(true);
    }
  };

  const handleJoinSpaces = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      // Show sign-in modal for unauthenticated users
      setAuthModalOpen(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03] animate-pulse"
          style={{
            backgroundImage: `url(${holographicGrid})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animationDuration: '8s'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse" 
             style={{animationDuration: '12s', animationDelay: '2s'}} />
      </div>
      
      <FloatingOrbs />
      <FloomHeader />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 lg:py-32 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
              {/* Live Activity Indicators */}
              <LiveActivityBadges />
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading leading-tight animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                Talk live. Surface Quality. Earn together.
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto font-body leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-300">
                Floom is a live miniapp built on Base where conversations meet Quality. 
                Host a Space, let FAKE-verified posts flow in, and engage without ever leaving the room. 
                Every action earns — transparent, on-chain, and fun.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-500">
                <Button 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-6 group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                  onClick={handleCreateSpace}
                  glow={true}
                >
                  <Plus className="mr-2 group-hover:animate-spin" size={20} />
                  Create Space
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-6 group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:bg-primary/5"
                  onClick={handleJoinSpaces}
                >
                  <Sparkles className="mr-2 group-hover:animate-pulse" size={20} />
                  Join Spaces
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading mb-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                How It Works
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center group hover:scale-105 transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-200">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-floom-accent/10 border border-floom-accent/20 mx-auto mb-6 group-hover:bg-floom-accent/20 group-hover:border-floom-accent/40 group-hover:shadow-lg group-hover:shadow-floom-accent/25 transition-all duration-300">
                  <Wallet className="w-8 h-8 text-floom-accent group-hover:animate-bounce" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading mb-4">Step 1 — Create or Join</h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Start your own Space in seconds or jump into a live one with your Base wallet.
                </p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-400">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-floom-accent/10 border border-floom-accent/20 mx-auto mb-6 group-hover:bg-floom-accent/20 group-hover:border-floom-accent/40 group-hover:shadow-lg group-hover:shadow-floom-accent/25 transition-all duration-300">
                  <Star className="w-8 h-8 text-floom-accent group-hover:animate-spin" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading mb-4">Step 2 — Pin Quality</h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  FAKE-scanned posts flow into your Space. Hosts pin the best, everyone engages.
                </p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-600">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-floom-accent/10 border border-floom-accent/20 mx-auto mb-6 group-hover:bg-floom-accent/20 group-hover:border-floom-accent/40 group-hover:shadow-lg group-hover:shadow-floom-accent/25 transition-all duration-300">
                  <TrendingUp className="w-8 h-8 text-floom-accent group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading mb-4">Step 3 — Earn Together</h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Stakes and actions split rewards automatically on-chain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rewards Split */}
        <section className="py-16 sm:py-24 px-4 bg-card/30 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animate-pulse" style={{animationDuration: '10s'}} />
          <div className="container mx-auto relative">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                Rewards Split
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground font-body max-w-3xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-200">
                Whenever Quality content is engaged in a Space:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <Card className="bg-card/50 border-floom-accent/20 group hover:scale-105 hover:shadow-xl hover:shadow-floom-accent/20 transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-300">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl sm:text-5xl font-heading text-floom-accent mb-2 group-hover:animate-pulse">70%</div>
                  <CardTitle className="text-lg sm:text-xl font-heading">Creator's Fee</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground font-body">
                    Original post creator
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-floom-accent/20 group hover:scale-105 hover:shadow-xl hover:shadow-floom-accent/20 transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-500">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl sm:text-5xl font-heading text-floom-accent mb-2 group-hover:animate-pulse">20%</div>
                  <CardTitle className="text-lg sm:text-xl font-heading">Host(s)</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground font-body">
                    Running the Space, sharing with speakers if they choose
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-floom-accent/20 group hover:scale-105 hover:shadow-xl hover:shadow-floom-accent/20 transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-700">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl sm:text-5xl font-heading text-floom-accent mb-2 group-hover:animate-pulse">10%</div>
                  <CardTitle className="text-lg sm:text-xl font-heading">FUUM Treasury</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground font-body">
                    Fueling future events & sustainability
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16 sm:py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading mb-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                Core Features
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="bg-card/30 border-border/50 hover:border-floom-accent/30 hover:scale-105 hover:shadow-lg hover:shadow-floom-accent/10 transition-all duration-500 group animate-in fade-in-0 slide-in-from-bottom-4 duration-1000"
                  style={{animationDelay: `${index * 200}ms`}}
                >
                  <CardHeader>
                    <feature.icon className="w-10 h-10 text-floom-accent mb-4 group-hover:animate-bounce group-hover:text-floom-accent/80 transition-colors duration-300" />
                    <CardTitle className="text-lg font-heading group-hover:text-floom-accent transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA Strip */}
        <section className="py-16 sm:py-24 px-4 bg-floom-accent/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 animate-pulse" style={{animationDuration: '6s'}} />
          <div className="container mx-auto text-center relative">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                Ready to set the vibe?
              </h2>
              
              <p className="text-lg sm:text-xl text-muted-foreground font-body animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-200">
                Create your Space now or jump into a live one already happening.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-400">
                <Button 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-6 group hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                  onClick={handleCreateSpace}
                  glow={true}
                >
                  <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-300" size={20} />
                  Create Space
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-6 group hover:scale-110 transition-all duration-300 hover:shadow-xl hover:bg-primary/10"
                  onClick={handleJoinSpaces}
                >
                  <Zap className="mr-2 group-hover:animate-pulse" size={20} />
                  Join Spaces
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border/50">
          <div className="container mx-auto">
            <div className="text-center text-muted-foreground font-body text-sm">
              Built on Base · A FUUM product · ©2025 Floom
            </div>
          </div>
        </footer>
      </main>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}