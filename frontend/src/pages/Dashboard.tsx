import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FloomHeader } from '@/components/FloomHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SpaceCard } from '@/components/SpaceCard';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, Calendar, Play, Radio, Clock, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useSpaces } from '@/hooks/useSpaces';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { spaces, loading, joinSpace, leaveSpace, deleteSpace } = useSpaces();
  const [searchQuery, setSearchQuery] = useState('');

  const handleJoinSpace = async (spaceId: string) => {
    if (!user) {
      // Redirect to sign in if not authenticated
      const signInButton = document.querySelector('[data-sign-in]');
      if (signInButton) {
        (signInButton as HTMLElement).click();
      }
      return;
    }
    
    try {
      await joinSpace(spaceId);
      // Navigate to the live space
      navigate(`/space/${spaceId}`);
    } catch (error) {
      console.error('Error joining space:', error);
      alert('Failed to join space. Please try again.');
    }
  };

  const handleRemindMe = (spaceId: string) => {
    console.log('Setting reminder for space:', spaceId);
    // TODO: Implement actual reminder functionality
    alert('Reminder set! We\'ll notify you when this space goes live.');
  };

  const handleShareSpace = async (spaceId: string) => {
    const spaceUrl = `${window.location.origin}/space/${spaceId}`;
    
    try {
      await navigator.clipboard.writeText(spaceUrl);
      alert(`Space link copied to clipboard!\n\n${spaceUrl}\n\nShare this with others to invite them to join.`);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = spaceUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`Space link copied to clipboard!\n\n${spaceUrl}\n\nShare this with others to invite them to join.`);
    }
  };

  const handleDeleteSpace = async (spaceId: string) => {
    if (!user) return;
    await deleteSpace(spaceId);
  };

  // Filter spaces based on search query
  const filteredSpaces = spaces.filter(space =>
    space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    space.host?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categorize spaces
  const trendingSpaces = filteredSpaces.filter(space => space.is_live); // Popular live spaces
  const liveSpaces = filteredSpaces.filter(space => space.is_live); // All live spaces  
  const upcomingSpaces = filteredSpaces.filter(space => !space.is_live); // Scheduled spaces
  const mySpaces = filteredSpaces.filter(space => space.host_id === user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <FloomHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading spaces...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <FloomHeader />
      
      <main className="container mx-auto px-4 py-4 space-y-6">
        {/* Welcome section */}
        <div className="text-center space-y-4 py-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome to Floom
          </h1>
          
          {/* Create Action */}
          <div className="max-w-md mx-auto">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/create')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Space
            </Button>
          </div>
        </div>

        {/* Search for Spaces */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search spaces, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Trending</span>
              <span className="sm:hidden">Trend</span>
            </TabsTrigger>
            <TabsTrigger value="live" className="text-sm">
              <Radio className="w-4 h-4 mr-1 sm:mr-2" />
              Live
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-sm">
              <Clock className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Upcoming</span>
              <span className="sm:hidden">Soon</span>
            </TabsTrigger>
            <TabsTrigger value="clips" className="text-sm">
              <Play className="w-4 h-4 mr-1 sm:mr-2" />
              Clips
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="space-y-4">
            {trendingSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingSpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    onJoin={handleJoinSpace}
                    onRemind={handleRemindMe}
                    onShare={handleShareSpace}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No trending spaces right now</h3>
                <p className="text-muted-foreground mb-4">Check out what's happening in other tabs!</p>
                <Button onClick={() => navigate('/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Space
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="live" className="space-y-4">
            {liveSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveSpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    onJoin={handleJoinSpace}
                    onRemind={handleRemindMe}
                    onShare={handleShareSpace}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Radio className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No live spaces right now</h3>
                <p className="text-muted-foreground mb-4">Be the first to go live!</p>
                <Button onClick={() => navigate('/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Go Live
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingSpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    onJoin={handleJoinSpace}
                    onRemind={handleRemindMe}
                    onShare={handleShareSpace}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming spaces</h3>
                <p className="text-muted-foreground mb-4">Schedule your next conversation!</p>
                <Button onClick={() => navigate('/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Space
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="clips" className="space-y-4">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Play className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Clips coming soon</h3>
              <p className="text-muted-foreground">Save and share your favorite moments from spaces!</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;