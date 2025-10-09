import React, { useState, useEffect } from 'react';
import { FloomHeader } from '@/components/FloomHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Palette, Wallet, Shield, Star, Zap, Users, 
  Crown, Bell, Globe, Lock, Eye, EyeOff, Coins, TrendingUp,
  Link, Hash, Music, Mic, MessageSquare, Award, Camera,
  Settings2, Fingerprint, KeyRound, QrCode, ExternalLink, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Profile States
  const [walletConnected, setWalletConnected] = useState(false);
  const [farcasterConnected, setFarcasterConnected] = useState(false);
  const [ensConnected, setEnsConnected] = useState(false);
  
  // Quality Dashboard States
  const [qScore] = useState(87);
  const [stakes] = useState(1250);
  const [qualityPosts] = useState(34);
  const [engagementDepth] = useState(4.2);
  const [audienceDiversity] = useState(68);
  
  // Appearance States
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedFont, setSelectedFont] = useState('modern');
  const [nftBanner, setNftBanner] = useState(false);
  
  // Monetization States
  const [stakeToComment, setStakeToComment] = useState(false);
  const [spaceTicketing, setSpaceTicketing] = useState(false);
  const [autoSplitRevenue, setAutoSplitRevenue] = useState(true);
  const [qualityBounty, setQualityBounty] = useState(false);
  const [ticketPrice, setTicketPrice] = useState([50]);
  
  // Privacy States
  const [publicComments, setPublicComments] = useState(true);
  const [showStakeMetrics, setShowStakeMetrics] = useState(true);
  const [muteThreshold, setMuteThreshold] = useState([40]);
  const [blockLowQuality, setBlockLowQuality] = useState(false);
  
  // Space Settings
  const [defaultSpaceType, setDefaultSpaceType] = useState('arena');
  const [mintReplays, setMintReplays] = useState(false);
  const [defaultVisibility, setDefaultVisibility] = useState('open');
  
  // Security States
  const [onChainConfirms, setOnChainConfirms] = useState(false);
  const [creatorGuard, setCreatorGuard] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  const themes = [
    { id: 'light', name: 'Light', color: '#f8fafc' },
    { id: 'dark', name: 'Dark', color: '#0f172a' },
    { id: 'neon', name: 'Neon', color: '#7c3aed' },
    { id: 'minimal', name: 'Minimal', color: '#64748b' }
  ];

  const spaceTypes = [
    { id: 'arena', name: 'Arena', icon: Award, desc: 'Competitive discussions' },
    { id: 'chill', name: 'Chill', icon: Music, desc: 'Relaxed conversations' },
    { id: 'debate', name: 'Debate', icon: MessageSquare, desc: 'Structured debates' },
    { id: 'tutorial', name: 'Tutorial', icon: Star, desc: 'Educational content' },
    { id: 'music', name: 'Music', icon: Mic, desc: 'Music and audio focus' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <FloomHeader />
      
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="rounded-full px-4 py-2 border-border/50 hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              back
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quality Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Customize your Web3-native Floom experience
            </p>
            <div className="flex justify-center items-center gap-4 mt-4">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                Q-Score: {qScore}
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                {stakes} FUUM Staked
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="identity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1">
              <TabsTrigger value="identity" className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Identity</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-1">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Theme</span>
              </TabsTrigger>
              <TabsTrigger value="quality" className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Quality</span>
              </TabsTrigger>
              <TabsTrigger value="monetization" className="flex items-center gap-1">
                <Coins className="w-4 h-4" />
                <span className="hidden sm:inline">Revenue</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="spaces" className="flex items-center gap-1">
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Spaces</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-1">
                <Link className="w-4 h-4" />
                <span className="hidden sm:inline">Apps</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <KeyRound className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Identity Tab */}
            <TabsContent value="identity">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Web3 Identity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Base Wallet</Label>
                        <p className="text-sm text-muted-foreground">Connect your Coinbase/Base wallet</p>
                      </div>
                      <Button 
                        variant={walletConnected ? "secondary" : "default"}
                        size="sm"
                        onClick={() => setWalletConnected(!walletConnected)}
                      >
                        {walletConnected ? "Connected" : "Connect"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Farcaster</Label>
                        <p className="text-sm text-muted-foreground">Verify your Farcaster identity</p>
                      </div>
                      <Button 
                        variant={farcasterConnected ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setFarcasterConnected(!farcasterConnected)}
                      >
                        {farcasterConnected ? "Verified" : "Verify"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>ENS Domain</Label>
                        <p className="text-sm text-muted-foreground">Link your ENS name</p>
                      </div>
                      <Button 
                        variant={ensConnected ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setEnsConnected(!ensConnected)}
                      >
                        {ensConnected ? "Linked" : "Link"}
                      </Button>
                    </div>

                    {walletConnected && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">
                          <span className="font-medium">0x742d...4c8e</span> • Base Mainnet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>FUUM ID</Label>
                      <Input placeholder="@qualitycreator" />
                    </div>
                    
                    <div>
                      <Label>Bio</Label>
                      <Textarea placeholder="Building the future of quality conversations..." rows={3} />
                    </div>
                    
                    <div>
                      <Label>Interest Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Web3', 'AI', 'Design', 'Music', 'DeFi'].map((tag) => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-purple-500/20">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Theme & Colors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {themes.map((theme) => (
                        <div
                          key={theme.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedTheme === theme.id 
                              ? 'border-purple-500 bg-purple-500/10' 
                              : 'border-border hover:border-purple-300'
                          }`}
                          onClick={() => setSelectedTheme(theme.id)}
                        >
                          <div 
                            className="w-full h-12 rounded mb-2" 
                            style={{ backgroundColor: theme.color }}
                          />
                          <p className="text-sm font-medium text-center">{theme.name}</p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>NFT Banner</Label>
                          <p className="text-sm text-muted-foreground">Use your NFT as profile banner</p>
                        </div>
                        <Switch checked={nftBanner} onCheckedChange={setNftBanner} />
                      </div>

                      <div>
                        <Label>Font Style</Label>
                        <Select value={selectedFont} onValueChange={setSelectedFont}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="mono">Monospace</SelectItem>
                            <SelectItem value="serif">Serif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Quality Dashboard Tab */}
            <TabsContent value="quality">
              <div className="grid gap-6">
                <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      Quality Metrics Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <div className="text-2xl font-bold text-purple-400">{qScore}</div>
                        <div className="text-sm text-muted-foreground">Q-Score</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="text-2xl font-bold text-green-400">{stakes}</div>
                        <div className="text-sm text-muted-foreground">FUUM Staked</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="text-2xl font-bold text-blue-400">{qualityPosts}</div>
                        <div className="text-sm text-muted-foreground">Quality Posts</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <div className="text-2xl font-bold text-orange-400">{engagementDepth.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Engagement Depth</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Live Q-Score Tracker</Label>
                          <Switch defaultChecked />
                        </div>
                        <p className="text-sm text-muted-foreground">Show real-time Q-Score changes during spaces</p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Audience Diversity: {audienceDiversity}%</Label>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                            style={{ width: `${audienceDiversity}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Measure of audience quality diversity</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Monetization Tab */}
            <TabsContent value="monetization">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Revenue & Monetization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Stake-to-Comment</Label>
                        <p className="text-sm text-muted-foreground">Require FUUM stake to comment on your content</p>
                      </div>
                      <Switch checked={stakeToComment} onCheckedChange={setStakeToComment} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Space Ticketing</Label>
                          <p className="text-sm text-muted-foreground">Charge for premium space access</p>
                        </div>
                        <Switch checked={spaceTicketing} onCheckedChange={setSpaceTicketing} />
                      </div>

                      {spaceTicketing && (
                        <div className="ml-6 space-y-3 p-4 bg-secondary/30 rounded-lg">
                          <div>
                            <Label>Ticket Price: {ticketPrice[0]} FUUM</Label>
                            <Slider
                              value={ticketPrice}
                              onValueChange={setTicketPrice}
                              max={1000}
                              min={10}
                              step={10}
                              className="mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">≈ ${(ticketPrice[0] * 0.12).toFixed(2)} USD</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Accept FUUM
                            </Button>
                            <Button size="sm" variant="outline">
                              Accept ETH
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-Split Revenue</Label>
                        <p className="text-sm text-muted-foreground">Automatically split with collaborators</p>
                      </div>
                      <Switch checked={autoSplitRevenue} onCheckedChange={setAutoSplitRevenue} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Quality Bounty System</Label>
                        <p className="text-sm text-muted-foreground">Reward high-quality contributions</p>
                      </div>
                      <Switch checked={qualityBounty} onCheckedChange={setQualityBounty} />
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-green-600 dark:text-green-400">Total Earnings (30d)</p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">2,847 FUUM</p>
                        </div>
                        <Button size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privacy & Quality Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public Comments</Label>
                        <p className="text-sm text-muted-foreground">Allow all users to comment</p>
                      </div>
                      <Switch checked={publicComments} onCheckedChange={setPublicComments} />
                    </div>

                    {!publicComments && (
                      <div className="ml-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          Only Quality-verified users can comment on your content
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Stake Metrics</Label>
                        <p className="text-sm text-muted-foreground">Display your FUUM stakes publicly</p>
                      </div>
                      <Switch checked={showStakeMetrics} onCheckedChange={setShowStakeMetrics} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-Mute Low Quality</Label>
                          <p className="text-sm text-muted-foreground">Hide comments below quality threshold</p>
                        </div>
                        <Switch checked={blockLowQuality} onCheckedChange={setBlockLowQuality} />
                      </div>

                      {blockLowQuality && (
                        <div className="space-y-2">
                          <Label>Quality Threshold: {muteThreshold[0]}</Label>
                          <Slider
                            value={muteThreshold}
                            onValueChange={setMuteThreshold}
                            max={100}
                            min={10}
                            step={5}
                          />
                          <p className="text-xs text-muted-foreground">Comments below Q-Score {muteThreshold[0]} will be hidden</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Wallet Interactions
                      </h4>
                      <div className="space-y-3 ml-6">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Eye className="w-4 h-4 mr-2" />
                          View Blocked Wallets
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Limit New Wallet Interactions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Spaces Tab */}
            <TabsContent value="spaces">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      Space Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Default Space Type</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {spaceTypes.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <div
                              key={type.id}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                defaultSpaceType === type.id 
                                  ? 'border-purple-500 bg-purple-500/10' 
                                  : 'border-border hover:border-purple-300'
                              }`}
                              onClick={() => setDefaultSpaceType(type.id)}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent className="w-5 h-5 text-purple-400" />
                                <div>
                                  <p className="font-medium">{type.name}</p>
                                  <p className="text-xs text-muted-foreground">{type.desc}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mint Replays as NFTs</Label>
                        <p className="text-sm text-muted-foreground">Auto-mint space highlights</p>
                      </div>
                      <Switch checked={mintReplays} onCheckedChange={setMintReplays} />
                    </div>

                    <div>
                      <Label>Default Visibility</Label>
                      <Select value={defaultVisibility} onValueChange={setDefaultVisibility}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Open (Everyone)
                            </div>
                          </SelectItem>
                          <SelectItem value="members">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Members Only
                            </div>
                          </SelectItem>
                          <SelectItem value="nft">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              NFT Holders
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {mintReplays && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">NFT Minting Settings</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Mint Fee</span>
                            <span className="text-sm font-medium">0.005 ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Creator Royalty</span>
                            <span className="text-sm font-medium">7.5%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link className="w-5 h-5" />
                      Connected Apps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">F</span>
                        </div>
                        <div>
                          <Label>Floom Store</Label>
                          <p className="text-sm text-muted-foreground">Digital items & NFTs</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm">Connected</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">FC</span>
                        </div>
                        <div>
                          <Label>Farcaster</Label>
                          <p className="text-sm text-muted-foreground">Cross-post notifications</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Music className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <Label>Spotify</Label>
                          <p className="text-sm text-muted-foreground">Music space integration</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Space Mentions</Label>
                        <p className="text-sm text-muted-foreground">When mentioned in spaces</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Quality Milestones</Label>
                        <p className="text-sm text-muted-foreground">Q-Score achievements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Revenue Updates</Label>
                        <p className="text-sm text-muted-foreground">Earnings and payouts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Farcaster Bridge</Label>
                        <p className="text-sm text-muted-foreground">Cross-platform notifications</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5" />
                      Security & Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>On-Chain Confirmations</Label>
                        <p className="text-sm text-muted-foreground">Require blockchain verification for profile edits</p>
                      </div>
                      <Switch checked={onChainConfirms} onCheckedChange={setOnChainConfirms} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Creator Guard</Label>
                        <p className="text-sm text-muted-foreground">Protect against profile clones</p>
                      </div>
                      <Switch checked={creatorGuard} onCheckedChange={setCreatorGuard} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">FUUM signature + authenticator app</p>
                        </div>
                        <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                      </div>

                      {twoFactorAuth && (
                        <div className="ml-6 space-y-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <p className="text-sm text-green-600 dark:text-green-400 mb-3">2FA Setup Required</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <QrCode className="w-4 h-4 mr-2" />
                              Scan QR Code
                            </Button>
                            <Button size="sm" variant="outline">
                              <Fingerprint className="w-4 h-4 mr-2" />
                              Add Backup Key
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Account Protection
                      </h4>
                      <div className="space-y-2 ml-6">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Active Sessions (3)
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Connected Apps (7)
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          Export Account Data
                        </Button>
                        <Button variant="destructive" size="sm" className="w-full justify-start">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {creatorGuard && (
                  <Card className="border-green-500/20 bg-green-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Shield className="w-5 h-5" />
                        Creator Guard Active
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Profile Hash</span>
                          <Badge variant="secondary">0xf7a8...9e2c</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Last Verification</span>
                          <span className="text-sm text-muted-foreground">2 hours ago</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Clone Attempts Blocked</span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">12</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;