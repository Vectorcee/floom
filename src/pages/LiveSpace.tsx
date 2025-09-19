import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SpeakerAvatar } from "@/components/SpeakerAvatar";
import { PinnedPostCard } from "@/components/PinnedPostCard";
import { EarnMeter } from "@/components/EarnMeter";
import { 
  Users, 
  Clock, 
  Mic, 
  MicOff, 
  Hand, 
  Heart, 
  Laugh, 
  Zap,
  ArrowLeft 
} from "lucide-react";
import audioWave from "@/assets/audio-wave.jpg";

const mockSpace = {
  id: "1",
  title: "Base Builders Night",
  host: { name: "DevAlpha", avatar: "", handle: "devalpha" },
  listeners: 542,
  duration: "45m",
};

const mockSpeakers = [
  { name: "DevAlpha", status: "speaking", isHost: true },
  { name: "Sarah Chen", status: "idle", isHost: false },
  { name: "Marcus AI", status: "muted", isHost: false },
  { name: "Builder23", status: "requesting", isHost: false },
];

const mockPinnedPost = {
  id: "1",
  creator: {
    name: "DevAlpha",
    avatar: "",
    handle: "devalpha"
  },
  qScore: 88,
  snippet: "Modular rollups for creators' payout rails could revolutionize how we think about content monetization on Base. The key is building composable primitives that work across different social layers...",
  topicTags: ["#DeFi", "#Creators", "#Base"],
  url: "https://example.com/post/1"
};

const mockQualityFeed = [
  {
    id: "2",
    creator: { name: "YieldGuru", avatar: "", handle: "yieldguru" },
    qScore: 75,
    snippet: "New yield farming strategy on Base just dropped 🔥",
    topicTags: ["#DeFi", "#Yield"],
    url: "https://example.com/post/2"
  },
  {
    id: "3", 
    creator: { name: "BaseBuilder", avatar: "", handle: "basebuilder" },
    qScore: 82,
    snippet: "Smart contract gas optimization tricks that saved us 40%",
    topicTags: ["#Builders", "#Gas"],
    url: "https://example.com/post/3"
  },
];

export default function LiveSpace() {
  const [isMuted, setIsMuted] = useState(true);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(156);

  const reactions = [
    { icon: Heart, label: "❤️" },
    { icon: Laugh, label: "😂" },
    { icon: Zap, label: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Audio Visualization */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url(${audioWave})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(1px)',
        }}
      />

      {/* Top Bar */}
      <header className="relative border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
                <ArrowLeft size={16} className="mr-1" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <SpeakerAvatar 
                  name={mockSpace.host.name}
                  size="sm"
                  isHost={true}
                />
                <div>
                  <h1 className="font-heading text-lg">{mockSpace.title}</h1>
                  <p className="text-xs text-muted-foreground">
                    by @{mockSpace.host.handle}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{mockSpace.listeners.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{mockSpace.duration}</span>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                End Space
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            
            {/* Left: Stage (65% on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Speakers Grid */}
              <Card className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <h3 className="font-heading text-lg mb-4">On Stage</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 flex-1 place-items-center">
                    {mockSpeakers.map((speaker, index) => (
                      <SpeakerAvatar
                        key={index}
                        name={speaker.name}
                        size="lg"
                        status={speaker.status as any}
                        isHost={speaker.isHost}
                      />
                    ))}
                  </div>

                  {/* Stage Controls */}
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline"
                      className={hasRaisedHand ? "bg-accent text-accent-foreground" : ""}
                      onClick={() => setHasRaisedHand(!hasRaisedHand)}
                    >
                      <Hand size={16} className="mr-2" />
                      {hasRaisedHand ? "Lower Hand" : "Raise Hand"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Quality Conveyor (35% on desktop) */}
            <div className="space-y-4 h-full overflow-hidden">
              {/* Pinned Post */}
              <div>
                <h3 className="font-heading text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  📌 Pinned Quality Post
                </h3>
                <PinnedPostCard 
                  post={mockPinnedPost}
                  onEngage={() => console.log('Engage')}
                  onStake={() => setEarnedAmount(prev => prev + 25)}
                  onClip={() => console.log('Clip')}
                  onShare={() => console.log('Share')}
                />
              </div>

              {/* Quality Feed */}
              <div className="flex-1 overflow-hidden">
                <h3 className="font-heading text-sm text-muted-foreground mb-2">
                  Live Quality Feed
                </h3>
                <div className="space-y-3 h-full overflow-y-auto">
                  {mockQualityFeed.map((post) => (
                    <PinnedPostCard 
                      key={post.id}
                      post={post}
                      className="scale-95"
                      onEngage={() => console.log('Engage')}
                      onStake={() => setEarnedAmount(prev => prev + 15)}
                      onClip={() => console.log('Clip')}
                      onShare={() => console.log('Share')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mic Toggle */}
            <Button
              variant={isMuted ? "outline" : "default"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-2"
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              {isMuted ? "Unmute" : "Mute"}
            </Button>

            {/* Reactions */}
            <div className="flex items-center gap-2">
              {reactions.map((Reaction, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-lg"
                  onClick={() => console.log('React', Reaction.label)}
                >
                  {Reaction.label}
                </Button>
              ))}
            </div>

            {/* Earn Meter */}
            <div className="flex items-center gap-4">
              <EarnMeter currentAmount={earnedAmount} className="w-32" />
              <Button variant="default" size="sm">
                Quick Stake
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}