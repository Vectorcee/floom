import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FloomHeader } from "@/components/FloomHeader";
import { ArrowLeft, Calendar, Users, Shield, Zap } from "lucide-react";

const topicTags = ["#DeFi", "#Builders", "#Creators", "#AIxWeb3", "#OpenSource", "#NFTs", "#Gaming", "#DAO"];

export default function CreateSpace() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    language: "English",
    isPublic: true,
    qMinThreshold: 70,
    scheduledTime: "",
    cohosts: [],
  });

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleCreate = () => {
    console.log('Creating space:', formData);
    // Navigate to live space
    window.location.href = '/space/new';
  };

  return (
    <div className="min-h-screen bg-background">
      <FloomHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => window.location.href = '/'}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Lobby
            </Button>
            <div>
              <h1 className="text-3xl font-heading">Create Your Space</h1>
              <p className="text-muted-foreground font-body">
                Start a live conversation where quality content flows
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Space Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="font-body">Space Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Base Builders Night"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="font-body">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="What will you discuss in this space?"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="font-body">Topic Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {topicTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={formData.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer transition-floom"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Space Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-body">Public Space</Label>
                      <p className="text-sm text-muted-foreground">
                        Anyone can join and listen
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                    />
                  </div>

                  <div>
                    <Label className="font-body">Quality Threshold</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Input
                        type="number"
                        min={50}
                        max={95}
                        value={formData.qMinThreshold}
                        onChange={(e) => setFormData(prev => ({ ...prev, qMinThreshold: Number(e.target.value) }))}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        Only posts with Q-Score ≥ {formData.qMinThreshold} will appear
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="scheduled" className="font-body">Schedule for Later (Optional)</Label>
                    <Input
                      id="scheduled"
                      type="datetime-local"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mock Space Card Preview */}
                  <div className="p-4 border border-border rounded-lg bg-card/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-full bg-accent" />
                      <div>
                        <p className="text-sm font-body font-medium">You</p>
                        <p className="text-xs text-muted-foreground">@host</p>
                      </div>
                      {!formData.scheduledTime && (
                        <Badge variant="outline" className="ml-auto">
                          <div className="h-2 w-2 rounded-full bg-accent mr-1" />
                          LIVE
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-heading text-base mb-2">
                      {formData.title || "Your Space Title"}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {formData.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users size={12} />
                        <span>0</span>
                      </div>
                      {formData.scheduledTime ? (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>Scheduled</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Zap size={12} />
                          <span>Starting</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quality Info */}
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={16} className="text-accent" />
                      <span className="text-sm font-heading">Quality Filter</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Posts with Q-Score ≥ {formData.qMinThreshold} will flow into your space, 
                      ensuring high-quality conversations.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Create Button */}
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleCreate}
                disabled={!formData.title.trim()}
              >
                {formData.scheduledTime ? "Schedule Space" : "Go Live Now"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}