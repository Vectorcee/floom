import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpaceCard } from "@/components/SpaceCard";
import { FloomHeader } from "@/components/FloomHeader";
import { Plus, TrendingUp, Clock, Zap } from "lucide-react";

const trendingSpaces = [
  {
    id: "1",
    title: "Base Builders Night",
    host: { name: "DevAlpha", avatar: "", handle: "devalpha" },
    listeners: 542,
    duration: "45m",
    scheduledTime: null,
    tags: ["#DeFi", "#Builders", "#Base"],
    isLive: true
  },
  {
    id: "2", 
    title: "AI x Web3 Future",
    host: { name: "Sarah Chen", avatar: "", handle: "sarahc" },
    listeners: 328,
    duration: "32m",
    scheduledTime: null,
    tags: ["#AI", "#Web3", "#Future"],
    isLive: true
  },
  {
    id: "3",
    title: "NFT Creator Spotlight",
    host: { name: "ArtistDAO", avatar: "", handle: "artistdao" },
    listeners: 199,
    duration: "1h 12m",
    scheduledTime: null,
    tags: ["#NFTs", "#Creators", "#Art"],
    isLive: true
  }
];

const newSpaces = [
  {
    id: "4",
    title: "DAO Governance Deep Dive",
    host: { name: "Marcus AI", avatar: "", handle: "marcusai" },
    listeners: 0,
    duration: "0m",
    scheduledTime: "2024-01-20T19:00:00",
    tags: ["#DAO", "#Governance"],
    isLive: false
  },
  {
    id: "5",
    title: "DeFi Yield Strategies",
    host: { name: "YieldGuru", avatar: "", handle: "yieldguru" },
    listeners: 0,
    duration: "0m", 
    scheduledTime: "2024-01-20T21:30:00",
    tags: ["#DeFi", "#Yield"],
    isLive: false
  }
];

const clips = [
  {
    id: "1",
    title: "Best practices for smart contract security",
    creator: "DevAlpha",
    duration: "2:45",
    views: "1.2k",
    likes: 89
  },
  {
    id: "2", 
    title: "Why modular rollups are the future",
    creator: "Sarah Chen",
    duration: "3:21",
    views: "856",
    likes: 67
  },
  {
    id: "3",
    title: "Building user-friendly DeFi protocols",
    creator: "YieldGuru", 
    duration: "4:12",
    views: "632",
    likes: 45
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <FloomHeader />
      
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-heading text-foreground">
              Welcome to Floom
            </h1>
            <p className="text-muted-foreground font-body mt-2">
              Discover trending spaces, join conversations, and create quality content
            </p>
          </div>
          <Button size="lg" className="w-full sm:w-auto" onClick={() => window.location.href = '/create'}>
            <Plus size={20} className="mr-2" />
            Create Space
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Trending Spaces */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-primary" size={24} />
              <h2 className="text-2xl font-heading">Trending Spaces</h2>
              <Badge variant="secondary" className="text-xs">LIVE</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onJoin={() => window.location.href = `/space/${space.id}`}
                />
              ))}
            </div>
          </section>

          {/* New Spaces */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-accent" size={24} />
              <h2 className="text-2xl font-heading">New Spaces</h2>
              <Badge variant="outline" className="text-xs">SCHEDULED</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onRemind={() => console.log('Remind me:', space.id)}
                />
              ))}
            </div>
          </section>

          {/* Clips */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-accent" size={24} />
              <h2 className="text-2xl font-heading">Trending Clips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clips.map((clip) => (
                <Card key={clip.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
                      <Zap size={32} className="text-primary" />
                    </div>
                    <h3 className="font-heading text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {clip.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-body">by {clip.creator}</span>
                      <span>{clip.duration}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>{clip.views} views</span>
                      <span>{clip.likes} likes</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}