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
import { spacesApi } from "@/services/spacesApi";
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

// Real-time speaker system - no more fake data
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

// Create real speakers list based on actual participants
const createRealSpeakers = (currentSpace: Space, user: any, profile: any): Speaker[] => {
  const speakers: Speaker[] = [];
  
  // Only add the authenticated user if they exist
  if (user && profile) {
    const userSpeaker: Speaker = {
      id: user.id,
      name: profile.name || profile.display_name || 'You',
      avatar: profile.avatar || profile.avatar_url || getRandomAvatar(user.id),
      isHost: currentSpace.host_id === user.id,
      isMuted: true,
      isHandRaised: false,
      isSpeaking: false,
      fpEarned: 0
    };
    speakers.push(userSpeaker);
  }
  
  return speakers;
};

export default function LiveSpace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { spaces, joinSpace } = useSpaces();
  
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [earnedFP, setEarnedFP] = useState(0);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [listeners, setListeners] = useState<Speaker[]>([]);
  const [fpActivities, setFpActivities] = useState<FpActivity[]>([]);
  const [isUserSpeaker, setIsUserSpeaker] = useState(false);

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
          // Only show real speakers, no fake data
          setSpeakers(createRealSpeakers(existingSpace, user, profile));
        } else {
          // Fetch from backend API if not in current list
          const spaceData = await spacesApi.getSpace(id);

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
            // For now, we'll use a default host structure since backend doesn't provide full profile
            host: {
              display_name: 'Host',
              handle: 'host',
              avatar_url: getRandomAvatar('host')
            },
            participant_count: spaceData.participant_count || 0,
            is_participant: false,
          };

          setCurrentSpace(space);
          // Only show real speakers, no fake data
          setSpeakers(createRealSpeakers(space, user, profile));
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
      // Join silently without showing toast repeatedly
      const space = spaces.find(s => s.id === currentSpace.id);
      if (space && !space.is_participant) {
        joinSpace(currentSpace.id);
      }
      // Initialize user in space
      initializeUserInSpace();
    }
  }, [currentSpace, user]); // Removed joinSpace from dependencies to prevent loops

  const initializeUserInSpace = () => {
    if (!user || !currentSpace) return;
    
    const userSpeaker: Speaker = {
      id: user.id,
      name: profile.name,
      avatar: profile.avatar,
      isHost: currentSpace.host_id === user.id,
      isMuted: true,
      isHandRaised: false,
      isSpeaking: false,
      fpEarned: 0
    };

    if (currentSpace.host_id === user.id) {
      // User is host - add to speakers
      setSpeakers(prev => {
        const existing = prev.find(s => s.id === user.id);
        if (existing) return prev;
        return [...prev, userSpeaker];
      });
      setIsUserSpeaker(true);
    } else {
      // User is listener
      setListeners(prev => {
        const existing = prev.find(s => s.id === user.id);
        if (existing) return prev;
        return [...prev, userSpeaker];
      });
    }
  };

  const handleRaiseHand = () => {
    if (!user) return;
    setHasRaisedHand(!hasRaisedHand);
    // TODO: Send to real-time service
    awardFP(QUALITY_ACTIONS.ASK_QUESTION, "Raised hand to speak");
  };

  const handleReaction = (type: 'heart' | 'laugh') => {
    if (!user) return;
    const points = type === 'heart' ? QUALITY_ACTIONS.HEART_REACTION : QUALITY_ACTIONS.FUNNY_REACTION;
    awardFP(points, `${type} reaction`);
  };

  const awardFP = (points: number, action: string) => {
    if (!user) return;
    
    setEarnedFP(prev => prev + points);
    
    const activity: FpActivity = {
      id: `${Date.now()}-${Math.random()}`,
      user: profile.name,
      action,
      points,
      timestamp: new Date()
    };
    
    setFpActivities(prev => [activity, ...prev].slice(0, 10));
    
    // TODO: Send to backend for persistence
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Back button and Space info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="shrink-0 hover:bg-primary/10"
              >
                <ArrowLeft size={16} className="lg:mr-2" />
                <span className="hidden lg:inline">Back</span>
              </Button>
              
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={currentSpace.host?.avatar_url} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {(currentSpace.host?.display_name || 'H').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="font-heading text-lg lg:text-xl truncate flex items-center gap-2">
                    {currentSpace.title}
                    <Badge className="bg-red-500 text-white animate-pulse px-2 py-1">
                      <Radio size={12} className="mr-1" />
                      LIVE
                    </Badge>
                  </h1>
                  <p className="text-sm text-muted-foreground truncate">
                    by @{currentSpace.host?.handle || 'host'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                <Users size={14} />
                <span className="text-sm font-medium">{speakers.length + listeners.length}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleInviteOthers}
                className="hover:bg-primary/10"
              >
                <Share size={14} className="mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Space Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Space Description */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {currentSpace.privacy === 'private' ? 'Private' : 'Public'}
                    </Badge>
                    <div className="flex gap-2">
                      {currentSpace.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {currentSpace.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {currentSpace.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Speakers Stage */}
            <Card className="bg-gradient-to-b from-card/80 to-card/50 border-primary/20 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Mic className="text-primary" size={20} />
                  On Stage ({speakers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {speakers.map((speaker, index) => (
                    <div key={speaker.id} className="text-center space-y-2">
                      <div className="relative">
                        <Avatar className={`h-16 w-16 mx-auto border-2 ${
                          speaker.isSpeaking ? 'border-green-400 animate-pulse' : 
                          speaker.isHost ? 'border-primary' : 'border-border'
                        }`}>
                          <AvatarImage src={speaker.avatar} />
                          <AvatarFallback className={`${
                            speaker.isHost ? 'bg-primary/20 text-primary' : 'bg-muted'
                          }`}>
                            {speaker.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {speaker.isHost && (
                          <Crown className="absolute -top-1 -right-1 text-yellow-500" size={16} />
                        )}
                        {speaker.isMuted && (
                          <div className="absolute bottom-0 right-0 bg-red-500 rounded-full p-1">
                            <MicOff className="text-white" size={10} />
                          </div>
                        )}
                        {speaker.isHandRaised && (
                          <div className="absolute bottom-0 left-0 bg-primary rounded-full p-1 animate-bounce">
                            <Hand className="text-white" size={10} />
                          </div>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium truncate">{speaker.name}</p>
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <img src={fpIcon} alt="FP" className="h-3 w-3" />
                          <span>{speaker.fpEarned}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Controls */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  
                  {/* Audio Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant={isMuted ? "outline" : "destructive"}
                      size="lg"
                      onClick={() => setIsMuted(!isMuted)}
                      className="relative hover:scale-105 transition-transform"
                    >
                      {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </Button>
                    
                    {!isUserSpeaker && (
                      <Button
                        variant={hasRaisedHand ? "default" : "outline"}
                        size="lg"
                        onClick={handleRaiseHand}
                        className="relative hover:scale-105 transition-transform"
                      >
                        <Hand size={20} />
                        {hasRaisedHand && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-bounce" />
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleReaction('heart')}
                      className="text-red-500 hover:bg-red-50 hover:scale-110 transition-all"
                    >
                      <Heart size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleReaction('laugh')}
                      className="text-yellow-500 hover:bg-yellow-50 hover:scale-110 transition-all"
                    >
                      <Laugh size={16} />
                    </Button>
                  </div>

                  {/* User FP Display */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                    <img src={fpIcon} alt="FP" className="h-5 w-5" />
                    <div className="text-sm">
                      <span className="font-bold text-primary">{earnedFP}</span>
                      <span className="text-muted-foreground ml-1">FP</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Listeners & Activity */}
          <div className="space-y-6">
            
            {/* Listeners */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-muted-foreground" size={20} />
                  Listeners ({listeners.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {listeners.slice(0, 9).map((listener, index) => (
                    <div key={listener.id} className="text-center space-y-1">
                      <Avatar className="h-12 w-12 mx-auto border border-border">
                        <AvatarImage src={listener.avatar} />
                        <AvatarFallback className="bg-muted text-xs">
                          {listener.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-medium truncate">{listener.name}</p>
                    </div>
                  ))}
                </div>
                {listeners.length > 9 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    +{listeners.length - 9} more listeners
                  </p>
                )}
              </CardContent>
            </Card>

            {/* FP Activity Feed */}
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-primary" size={20} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {fpActivities.length > 0 ? (
                    fpActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <img src={fpIcon} alt="FP" className="h-3 w-3" />
                          <span className="text-sm font-bold">+{activity.points}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No activity yet. Start engaging to earn FP!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}