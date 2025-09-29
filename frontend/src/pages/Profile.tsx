import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getRandomAvatar, fileToBase64, validateImageFile } from "@/utils/avatarUtils";
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
  X,
  Camera,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { useState, useRef } from "react";
import tokenIcon from "@/assets/token-icon.jpg";
import fpIcon from "@/assets/fp-icon-new.png";

// Remove all mock data - use real user data only

export default function Profile() {
  const { user } = useAuth();
  const { spaces } = useSpaces();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || 'Anonymous User',
    username: user?.username || 'user',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  
  // Filter spaces hosted by the current user
  const hostedSpaces = spaces.filter(space => space.host_id === user?.id);
  
  const handleSaveProfile = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', editedProfile);
    setIsEditing(false);
    // TODO: Implement actual save functionality
  };
  
  const handleCancelEdit = () => {
    setEditedProfile({
      name: user?.name || 'Anonymous User',  
      username: user?.username || 'user',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };
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
            <div className="flex gap-2">
              {user ? (
                isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save size={16} className="mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                )
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <Edit size={16} className="mr-2" />
                  Sign in to Edit
                </Button>
              )}
            </div>
          </div>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24 mx-auto md:mx-0">
                  <AvatarImage src={editedProfile.avatar} alt={editedProfile.name} />
                  <AvatarFallback className="bg-secondary text-2xl">
                    {editedProfile.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        placeholder="Display Name"
                        className="text-2xl font-heading"
                      />
                      <Input
                        value={editedProfile.username}
                        onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                        placeholder="Username"
                        className="text-muted-foreground"
                      />
                      <Textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                        placeholder="Bio (optional)"
                        className="font-body text-sm resize-none"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-heading">{editedProfile.name}</h2>
                      <p className="text-muted-foreground mb-2">@{editedProfile.username}</p>
                      {editedProfile.bio && (
                        <p className="font-body text-sm mb-4">{editedProfile.bio}</p>
                      )}
                      
                      <div className="flex justify-center md:justify-start">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users size={12} />
                          0 Followers
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
                
                {!user && (
                  <div className="flex md:flex-col gap-4">
                    <Button variant="outline">Follow</Button>
                    <Button>Message</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <img src={fpIcon} alt="FUUM" className="h-6 w-6 mr-1" />
                  <span className="text-2xl font-heading">0</span>
                </div>
                <p className="text-xs text-muted-foreground">FUUM Balance</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users size={16} className="mr-1" />
                  <span className="text-2xl font-heading">{hostedSpaces.length}</span>
                </div>
                <p className="text-xs text-muted-foreground">Spaces Hosted</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star size={16} className="mr-1" />
                  <span className="text-2xl font-heading">0%</span>
                </div>
                <p className="text-xs text-muted-foreground">Avg Retention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Scissors size={16} className="mr-1" />
                  <span className="text-2xl font-heading">0</span>
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
              <p className="text-center text-muted-foreground py-12">
                Your clips will appear here once you create them.
              </p>
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