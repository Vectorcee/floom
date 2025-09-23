import { Button } from "@/components/ui/button";
import { FloomHeader } from "@/components/FloomHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Headphones
} from "lucide-react";
import holographicGrid from "@/assets/holographic-grid.jpg";
import { useAuth } from "@/hooks/useAuth";

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

export default function Lobby() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url(${holographicGrid})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <FloomHeader />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 lg:py-32 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-headline leading-tight">
                Talk live. Surface Quality. Earn together.
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto font-body leading-relaxed">
                Floom is a live miniapp built on Base where conversations meet Quality. 
                Host a Space, let FAKE-verified posts flow in, and engage without ever leaving the room. 
                Every action earns — transparent, on-chain, and fun.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-12">
                <Button 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-6"
                  onClick={() => user ? window.location.href = '/create' : alert('Please sign in to create a space')}
                  glow={true}
                >
                  <Plus className="mr-2" size={20} />
                  Create Space
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-6"
                >
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline mb-4">
                How It Works
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-floom-accent/10 border border-floom-accent/20 mx-auto mb-6">
                  <Wallet className="w-8 h-8 text-floom-accent" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading mb-4">Step 1 — Create or Join</h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Start your own Space in seconds or jump into a live one with your Base wallet.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-floom-accent/10 border border-floom-accent/20 mx-auto mb-6">
                  <Star className="w-8 h-8 text-floom-accent" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading mb-4">Step 2 — Pin Quality</h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  FAKE-scanned posts flow into your Space. Hosts pin the best, everyone engages.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-floom-accent/10 border border-floom-accent/20 mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-floom-accent" />
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
        <section className="py-16 sm:py-24 px-4 bg-card/30">
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline mb-6">
                Rewards Split
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground font-body max-w-3xl mx-auto">
                Whenever Quality content is engaged in a Space:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <Card className="bg-card/50 border-floom-accent/20">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl sm:text-5xl font-headline text-floom-accent mb-2">70%</div>
                  <CardTitle className="text-lg sm:text-xl font-heading">Creator's Fee</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground font-body">
                    Original post creator
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-floom-accent/20">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl sm:text-5xl font-headline text-floom-accent mb-2">20%</div>
                  <CardTitle className="text-lg sm:text-xl font-heading">Host(s)</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground font-body">
                    Running the Space, sharing with speakers if they choose
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-floom-accent/20">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl sm:text-5xl font-headline text-floom-accent mb-2">10%</div>
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline mb-4">
                Core Features
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/30 border-border/50 hover:border-floom-accent/30 transition-all duration-300">
                  <CardHeader>
                    <feature.icon className="w-10 h-10 text-floom-accent mb-4" />
                    <CardTitle className="text-lg font-heading">{feature.title}</CardTitle>
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
        <section className="py-16 sm:py-24 px-4 bg-floom-accent/5">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline">
                Ready to set the vibe?
              </h2>
              
              <p className="text-lg sm:text-xl text-muted-foreground font-body">
                Create your Space now or jump into a live one already happening.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-6"
                  onClick={() => user ? window.location.href = '/create' : alert('Please sign in to create a space')}
                  glow={true}
                >
                  <Plus className="mr-2" size={20} />
                  Create Space
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base sm:text-lg px-8 py-6"
                >
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
    </div>
  );
}