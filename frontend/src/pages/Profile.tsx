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
    avatar: user?.avatar || getRandomAvatar(user?.id),
    banner: user?.banner || ''
  });
  
  // File upload refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  // Upload states
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  
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
      avatar: user?.avatar || getRandomAvatar(user?.id),
      banner: user?.banner || ''
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setAvatarUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setEditedProfile(prev => ({ ...prev, avatar: base64 }));
    } catch (error) {
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setBannerUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setEditedProfile(prev => ({ ...prev, banner: base64 }));
    } catch (error) {
      alert('Failed to upload banner. Please try again.');
    } finally {
      setBannerUploading(false);
    }
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
            <div className="flex gap-2 shrink-0">
              {user ? (
                isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancelEdit} className="px-2 sm:px-3">
                      <X size={16} className="sm:mr-2" />
                      <span className="hidden sm:inline">Cancel</span>
                    </Button>
                    <Button size="sm" onClick={handleSaveProfile} className="px-2 sm:px-3">
                      <Save size={16} className="sm:mr-2" />
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="px-2 sm:px-3">
                    <Edit size={16} className="sm:mr-2" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                )
              ) : (
                <Button variant="outline" size="sm" disabled className="px-2 sm:px-3">
                  <Edit size={16} className="sm:mr-2" />
                  <span className="hidden sm:inline">Sign in to Edit</span>
                  <span className="sm:hidden">Sign in</span>
                </Button>
              )}
            </div>
          </div>

          {/* Profile Header with Banner */}
          <Card className="mb-8 overflow-hidden">
            {/* Banner Section */}
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
              {editedProfile.banner && (
                <img 
                  src={editedProfile.banner} 
                  alt="Profile banner" 
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Banner Upload Button (when editing) */}
              {isEditing && (
                <>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-none px-2 sm:px-3"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={bannerUploading}
                  >
                    {bannerUploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ImageIcon size={16} />
                    )}
                    <span className="ml-2 hidden md:inline text-sm">
                      {editedProfile.banner ? 'Change Banner' : 'Add Banner'}
                    </span>
                  </Button>
                </>
              )}
            </div>

            <CardContent className="relative px-6 pb-6">
              {/* Avatar with Upload */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 -mt-12 mb-4">
                <div className="relative self-center sm:self-start">
                  <Avatar className="h-24 w-24 border-4 border-background bg-background">
                    <AvatarImage src={editedProfile.avatar} alt={editedProfile.name} />
                    <AvatarFallback className="bg-secondary text-2xl">
                      {editedProfile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Avatar Upload Button (when editing) */}
                  {isEditing && (
                    <>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Button
                        variant="secondary"
                        size="sm" 
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-primary hover:bg-primary/90"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={avatarUploading}
                      >
                        {avatarUploading ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera size={14} className="text-white" />
                        )}
                      </Button>
                    </>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  {isEditing ? (
                    <div className="space-y-3 mt-4">
                      <Input
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        placeholder="Display Name"
                        className="text-xl font-heading"
                      />
                      <Input
                        value={editedProfile.username}
                        onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                        placeholder="Username"
                        className="text-base"
                      />
                      <Textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        className="font-body text-sm resize-none"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h2 className="text-2xl font-heading break-words">{editedProfile.name}</h2>
                      <p className="text-muted-foreground mb-3 break-words">@{editedProfile.username}</p>
                      {editedProfile.bio && (
                        <p className="font-body text-sm mb-4 text-foreground leading-relaxed break-words">
                          {editedProfile.bio}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users size={12} />
                          0 Followers
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users size={12} />
                          0 Following
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {!user ? (
                <div className="flex gap-3 justify-center sm:justify-end">
                  <Button variant="outline" size="sm">Follow</Button>
                  <Button size="sm">Message</Button>
                </div>
              ) : null}
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