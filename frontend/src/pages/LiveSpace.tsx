import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSpaces, Space } from "@/hooks/useSpaces";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/contexts/ProfileContext";
import { getRandomAvatar } from "@/utils/avatarUtils";
import { 
  Users, 
  Clock, 
  Mic, 
  MicOff, 
  Hand, 
  Heart, 
  Laugh, 
  Zap,
  ArrowLeft,
  Share,
  Link,
  Copy,
  Settings,
  MoreVertical,
  Volume2,
  VolumeX,
  Gift,
  Sparkles,
  Crown,
  Radio
} from "lucide-react";
import fpIcon from "@/assets/fp-icon-new.png";

// Enhanced speaker system for X Spaces-like experience
interface Speaker {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isMuted: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
  fpEarned: number;
}

// FP earning activities
interface FpActivity {
  id: string;
  user: string;
  action: string;
  points: number;
  timestamp: Date;
}

// Quality metrics for FP earning
const QUALITY_ACTIONS = {
  SPEAK_QUALITY: 5,    // FP per quality speaking contribution
  HEART_REACTION: 1,   // FP for giving hearts
  FUNNY_REACTION: 1,   // FP for laugh reactions
  SHARE_SPACE: 3,      // FP for sharing
  ASK_QUESTION: 2,     // FP for asking good questions
  HOST_BONUS: 10       // FP bonus for hosting
};

const getSampleSpeakers = (hostName: string, userId?: string): Speaker[] => [
  { 
    id: '1', 
    name: hostName, 
    avatar: getRandomAvatar('1'), 
    isHost: true, 
    isMuted: false, 
    isHandRaised: false, 
    isSpeaking: true,
    fpEarned: 25 
  },
  { 
    id: '2', 
    name: 'Alex Builder', 
    avatar: getRandomAvatar('2'), 
    isHost: false, 
    isMuted: false, 
    isHandRaised: false, 
    isSpeaking: false,
    fpEarned: 12 
  },
  { 
    id: '3', 
    name: 'Sarah Web3', 
    avatar: getRandomAvatar('3'), 
    isHost: false, 
    isMuted: true, 
    isHandRaised: false, 
    isSpeaking: false,
    fpEarned: 8 
  },
  { 
    id: '4', 
    name: 'Dev Anon', 
    avatar: getRandomAvatar('4'), 
    isHost: false, 
    isMuted: true, 
    isHandRaised: true, 
    isSpeaking: false,
    fpEarned: 5 
  },
];

export default function LiveSpace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { spaces, joinSpace } = useSpaces();
  
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(0);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [speakers, setSpeakers] = useState<any[]>([]);

  // Fetch space data
  useEffect(() => {
    const fetchSpace = async () => {
      if (!id) {
        navigate('/dashboard');
        return;
      }

      setLoading(true);
      try {
        // Try to find space in current spaces list first
        const existingSpace = spaces.find(space => space.id === id);
        if (existingSpace) {
          setCurrentSpace(existingSpace);
          setSpeakers(getSampleSpeakers(existingSpace.host?.display_name || 'Host'));
        } else {
          // Fetch from database if not in current list
          const { data: spaceData, error } = await supabase
            .from('spaces')
            .select(`
              *,
              profiles (
                display_name,
                handle,
                avatar_url
              )
            `)
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching space:', error);
            navigate('/dashboard');
            return;
          }

          const space: Space = {
            id: spaceData.id,
            title: spaceData.title,
            description: spaceData.description,
            host_id: spaceData.host_id,
            is_live: spaceData.is_live,
            scheduled_time: spaceData.scheduled_time,
            listener_count: spaceData.listener_count || 0,
            duration: spaceData.duration,
            tags: spaceData.tags || [],
            privacy: spaceData.privacy,
            quality_threshold: spaceData.quality_threshold,
            created_at: spaceData.created_at,
            updated_at: spaceData.updated_at,
            cover_image_url: spaceData.cover_image_url,
            host: spaceData.profiles,
            participant_count: 0,
            is_participant: false,
          };

          setCurrentSpace(space);
          setSpeakers(getSampleSpeakers(space.host?.display_name || 'Host'));
        }
      } catch (error) {
        console.error('Error loading space:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [id, spaces, navigate]);

  // Auto-join space if user is authenticated and not already a participant
  useEffect(() => {
    if (currentSpace && user && !currentSpace.is_participant) {
      joinSpace(currentSpace.id);
    }
  }, [currentSpace, user, joinSpace]);

  const handleInviteOthers = async () => {
    if (!currentSpace) return;
    
    const spaceUrl = `${window.location.origin}/space/${currentSpace.id}`;
    
    try {
      await navigator.clipboard.writeText(spaceUrl);
      // You could add a toast notification here
      alert(`Space link copied to clipboard!\n\n${spaceUrl}`);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = spaceUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`Space link copied to clipboard!\n\n${spaceUrl}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading space...</p>
        </div>
      </div>
    );
  }

  if (!currentSpace) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Space not found</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 lg:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'} className="shrink-0">
                <ArrowLeft size={16} className="lg:mr-1" />
                <span className="hidden lg:inline">Back</span>
              </Button>
              <div className="flex items-center gap-2 min-w-0">
                <SpeakerAvatar 
                  name={currentSpace.host?.display_name || 'Host'}
                  size="sm"
                  isHost={true}
                />
                <div className="min-w-0">
                  <h1 className="font-heading text-sm lg:text-lg truncate">{currentSpace.title}</h1>
                  <p className="text-xs text-muted-foreground truncate">
                    by @{currentSpace.host?.handle || 'host'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm shrink-0">
              <div className="flex items-center gap-1">
                <Users size={14} className="lg:size-4" />
                <span className="hidden sm:inline">{(currentSpace.participant_count || 0).toLocaleString()}</span>
                <span className="sm:hidden">{Math.max(1, Math.floor((currentSpace.participant_count || 0) / 1000 * 10) / 10)}k</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="lg:size-4" />
                <span>Live</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleInviteOthers}
                className="text-xs lg:text-sm"
              >
                <Share size={14} className="mr-1" />
                <span className="hidden lg:inline">Invite Others</span>
                <span className="lg:hidden">Invite</span>
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-xs lg:text-sm"
              >
                <span className="hidden lg:inline">End </span>Leave
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pb-20 lg:pb-28">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6 min-h-[calc(100vh-200px)] lg:min-h-[calc(100vh-240px)]">
            
            {/* Mobile: Quality Conveyor First */}
            <div className="lg:hidden space-y-3 max-h-[35vh] overflow-hidden">
              {/* Pinned Post */}
              <div>
                <h3 className="font-headline text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  📌 Pinned Quality Post
                </h3>
                <PinnedPostCard 
                  post={samplePinnedPost}
                  onEngage={() => console.log('Engage')}
                  onStake={() => setShowStakeModal(true)}
                  onShare={() => console.log('Share')}
                />
              </div>

              {/* Quality Feed - Mobile */}
              <div className="flex-1 overflow-hidden">
                <h3 className="font-heading text-sm text-muted-foreground mb-2">
                  Live Quality Feed
                </h3>
                <div className="space-y-2 h-28 overflow-y-auto">
                  {getSampleQualityFeed(currentSpace.tags).slice(0, 2).map((post) => (
                    <PinnedPostCard 
                      key={post.id}
                      post={post}
                      className="scale-95"
                      onEngage={() => console.log('Engage')}
                      onStake={() => setShowStakeModal(true)}
                      onShare={() => console.log('Share')}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Stage (Mobile second, Desktop first 65%) */}
            <div className="lg:col-span-2 flex-1">
              <Card className="h-full">
                <CardContent className="p-4 lg:p-6 h-full flex flex-col">
                  <h3 className="font-heading text-base lg:text-lg mb-4">On Stage</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 flex-1 place-items-center">
                    {speakers.map((speaker, index) => (
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
                  <div className="flex justify-center mt-4 lg:mt-6">
                    <Button 
                      variant="outline"
                      size="sm"
                      className={hasRaisedHand ? "bg-floom-accent text-black" : ""}
                      onClick={() => setHasRaisedHand(!hasRaisedHand)}
                    >
                      <Hand size={16} className="mr-2" />
                      {hasRaisedHand ? "Lower Hand" : "Raise Hand"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desktop: Quality Conveyor (35% on desktop) */}
            <div className="hidden lg:block space-y-4 h-full overflow-hidden">
              {/* Pinned Post */}
              <div>
                <h3 className="font-headline text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  📌 Pinned Quality Post
                </h3>
                <PinnedPostCard 
                  post={samplePinnedPost}
                  onEngage={() => console.log('Engage')}
                  onStake={() => setShowStakeModal(true)}
                  onShare={() => console.log('Share')}
                />
              </div>

              {/* Quality Feed - Desktop */}
              <div className="flex-1 overflow-hidden">
                <h3 className="font-headline text-sm text-muted-foreground mb-2">
                  Live Quality Feed
                </h3>
                <div className="space-y-3 h-full overflow-y-auto">
                  {getSampleQualityFeed(currentSpace.tags).map((post) => (
                    <PinnedPostCard 
                      key={post.id}
                      post={post}
                      className="scale-95"
                      onEngage={() => console.log('Engage')}
                      onStake={() => setShowStakeModal(true)}
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
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Mic Toggle */}
            <Button
              variant={isMuted ? "outline" : "default"}
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
              <span className="hidden sm:inline">{isMuted ? "Unmute to Speak" : "Mute"}</span>
            </Button>

            {/* Reactions */}
            <div className="flex items-center gap-1 lg:gap-2">
              {reactions.map((Reaction, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-sm lg:text-lg p-2 lg:p-3"
                  onClick={() => console.log('React', Reaction.label)}
                >
                  {Reaction.label}
                </Button>
              ))}
            </div>

            {/* Earn Meter */}
            <div className="flex items-center gap-2 lg:gap-4">
              <EarnMeter currentAmount={earnedAmount} className="w-20 lg:w-32" />
              <Button variant="default" size="sm" className="text-xs lg:text-sm">
                <span className="hidden sm:inline">Quick </span>Stake
              </Button>
            </div>
          </div>
        </div>
      </footer>
      
      <StakeComingSoonModal 
        isOpen={showStakeModal} 
        onClose={() => setShowStakeModal(false)} 
      />
    </div>
  );
}