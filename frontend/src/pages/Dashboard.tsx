import React, { useState } from 'react';
import { FloomHeader } from '@/components/FloomHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SpaceCard } from '@/components/SpaceCard';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, Calendar, Play, Search, Radio, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useSpaces } from '@/hooks/useSpaces';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { spaces, loading, joinSpace, leaveSpace } = useSpaces();
  const [searchQuery, setSearchQuery] = useState('');

  const handleJoinSpace = async (spaceId: string) => {
    const success = await joinSpace(spaceId);
    if (success) {
      navigate(`/space/${spaceId}`);
    }
  };

  const handleRemindMe = (spaceId: string) => {
    console.log('Setting reminder for space:', spaceId);
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
          
          {/* Search and Create */}
          <div className="max-w-md mx-auto space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search spaces, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
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
            {trendingSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingSpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    onJoin={handleJoinSpace}
                    onRemind={handleRemindMe}
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
            {newSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newSpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    onJoin={handleJoinSpace}
                    onRemind={handleRemindMe}
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