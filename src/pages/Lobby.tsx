import { Button } from "@/components/ui/button";
import { FloomHeader } from "@/components/FloomHeader";
import { SpaceCard } from "@/components/SpaceCard";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, Star, Plus } from "lucide-react";
import holographicGrid from "@/assets/holographic-grid.jpg";

const mockLiveSpaces = [
  {
    id: "1",
    title: "Base Builders Night",
    host: { name: "DevAlpha", avatar: "", handle: "devalpha" },
    listeners: 542,
    duration: "45m",
    tags: ["#DeFi", "#Builders"],
    isLive: true,
  },
  {
    id: "2", 
    title: "Creator Economy on Base",
    host: { name: "Sarah Chen", avatar: "", handle: "sarahbuilds" },
    listeners: 234,
    duration: "22m",
    tags: ["#Creators", "#Base"],
    isLive: true,
  },
  {
    id: "3",
    title: "AI x Web3 Future",
    host: { name: "Marcus AI", avatar: "", handle: "marcusai" },
    listeners: 189,
    duration: "1h 12m", 
    tags: ["#AIxWeb3", "#OpenSource"],
    isLive: true,
  },
];

const mockScheduledSpaces = [
  {
    id: "4",
    title: "DeFi Yield Strategies",
    host: { name: "Yield Master", avatar: "", handle: "yieldmaster" },
    listeners: 0,
    scheduledTime: "Tomorrow 2pm",
    tags: ["#DeFi", "#Yield"],
    isLive: false,
  },
  {
    id: "5",
    title: "NFT Art & Ownership",
    host: { name: "ArtDAO", avatar: "", handle: "artdao" },
    listeners: 0,
    scheduledTime: "Friday 7pm",
    tags: ["#NFTs", "#Art"],
    isLive: false,
  },
];

export default function Lobby() {
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
      
      <FloomHeader 
        user={{
          name: "DevAlpha",
          handle: "devalpha",
          avatar: ""
        }}
      />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <Badge variant="outline" className="mb-4">
                <Zap size={12} className="mr-1" />
                Powered by FAKE Quality Engine
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-heading leading-tight">
                Live Quality <span className="floom-gradient bg-clip-text text-transparent">Spaces</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
                Join conversations where FAKE-scanned posts flow live. 
                Talk, stake, and earn together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  size="lg" 
                  className="text-lg"
                  onClick={() => window.location.href = '/create'}
                >
                  <Plus className="mr-2" size={20} />
                  Start a Space
                </Button>
                <Button variant="outline" size="lg" className="text-lg">
                  Explore Spaces
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex justify-center gap-8 mt-12 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>12.5K+ Creators</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} />
                  <span>98% Quality Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  <span>$2.3M Earned</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Spaces */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-heading">Live Now</h2>
                <p className="text-muted-foreground font-body">
                  Join active conversations happening right now
                </p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {mockLiveSpaces.length} Live
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLiveSpaces.map((space) => (
                <SpaceCard 
                  key={space.id} 
                  space={space}
                  onJoin={() => window.location.href = `/space/${space.id}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Scheduled Spaces */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-heading">Scheduled</h2>
                <p className="text-muted-foreground font-body">
                  Upcoming spaces you won't want to miss
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockScheduledSpaces.map((space) => (
                <SpaceCard 
                  key={space.id} 
                  space={space}
                  onRemind={() => console.log('Set reminder for:', space.id)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}