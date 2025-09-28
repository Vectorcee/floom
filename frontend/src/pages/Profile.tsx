import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FloomHeader } from "@/components/FloomHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SpaceCard } from "@/components/SpaceCard";
import { useSpaces } from "@/hooks/useSpaces";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  Clock, 
  DollarSign, 
  Scissors, 
  Star,
  ArrowLeft,
  Settings,
  Edit,
  Save,
  X
} from "lucide-react";
import { useState } from "react";
import tokenIcon from "@/assets/token-icon.jpg";

// Remove all mock data - use real user data only

export default function Profile() {
  const { user } = useAuth();
  const { spaces } = useSpaces();
  
  // Filter spaces hosted by the current user
  const hostedSpaces = spaces.filter(space => space.host_id === user?.id);
  return (
    <div className="min-h-screen bg-background pb-20">
      <FloomHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => window.location.href = '/'}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Lobby
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-heading">Profile</h1>
            </div>
            <Button variant="outline" size="sm">
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
          </div>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24 mx-auto md:mx-0">
                  <AvatarImage src={mockProfile.avatar} alt={mockProfile.name} />
                  <AvatarFallback className="bg-secondary text-2xl">
                    {mockProfile.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-heading">{mockProfile.name}</h2>
                  <p className="text-muted-foreground mb-2">@{mockProfile.handle}</p>
                  <p className="font-body text-sm mb-4">{mockProfile.bio}</p>
                  
                  <div className="flex justify-center md:justify-start">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users size={12} />
                      {mockProfile.stats.followers.toLocaleString()} Followers
                    </Badge>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-4">
                  <Button variant="outline">Follow</Button>
                  <Button>Message</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <img src={tokenIcon} alt="FUUM" className="h-6 w-6 mr-1" />
                  <span className="text-2xl font-heading">{mockProfile.stats.fuumBalance.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">FUUM Balance</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users size={16} className="mr-1" />
                  <span className="text-2xl font-heading">{mockProfile.stats.spacesHosted}</span>
                </div>
                <p className="text-xs text-muted-foreground">Spaces Hosted</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star size={16} className="mr-1" />
                  <span className="text-2xl font-heading">{mockProfile.stats.avgRetention}%</span>
                </div>
                <p className="text-xs text-muted-foreground">Avg Retention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Scissors size={16} className="mr-1" />
                  <span className="text-2xl font-heading">{mockProfile.stats.clipsCreated}</span>
                </div>
                <p className="text-xs text-muted-foreground">Clips Created</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="hosted" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hosted">Hosted</TabsTrigger>
              <TabsTrigger value="spoke">Spoke In</TabsTrigger>
              <TabsTrigger value="clips">Clips</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hosted" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hostedSpaces.map((space) => (
                  <SpaceCard 
                    key={space.id} 
                    space={space}
                    onJoin={() => {}}
                    onRemind={() => {}}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="spoke" className="space-y-4">
              <p className="text-center text-muted-foreground py-12">
                Spaces where you've been a speaker will appear here.
              </p>
            </TabsContent>
            
            <TabsContent value="clips" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockClips.map((clip) => (
                  <Card key={clip.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-heading text-sm">{clip.title}</h3>
                        <Badge variant="outline" className="text-xs">{clip.duration}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        From {clip.fromSpace}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {clip.plays} plays
                        </span>
                        <Button variant="outline" size="sm">
                          Play
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="bookmarks" className="space-y-4">
              <p className="text-center text-muted-foreground py-12">
                Your bookmarked content will appear here.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}