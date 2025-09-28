import React, { useState } from 'react';
import { FloomHeader } from '@/components/FloomHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Users, Globe, Lock, X, Upload, ImageIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { useSpaces } from '@/hooks/useSpaces';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const CreateSpace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSpace } = useSpaces();
  const [isCreating, setIsCreating] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    isPrivate: false,
    qualityThreshold: [50],
    scheduledDate: undefined as Date | undefined,
    scheduledTime: '',
    isLive: false
  });

  const topicTags = [
    'Tech', 'Gaming', 'Music', 'Sports', 'Business', 'Art', 'Science', 
    'Politics', 'Health', 'Education', 'Entertainment', 'Travel',
    'DeFi', 'NFT', 'Web3', 'Crypto', 'Blockchain', 'DAO'
  ];

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!coverImage || !user) return null;

    const fileExt = coverImage.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('space-images')
      .upload(fileName, coverImage);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('space-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleCreate = async (goLive = false) => {
    if (!user) {
      return;
    }

    setIsCreating(true);
    
    try {
      let scheduledTime: string | undefined;
      let coverImageUrl: string | null = null;
      
      // Upload image if provided
      if (coverImage) {
        coverImageUrl = await uploadImage();
      }
      
      if (!goLive && formData.scheduledDate && formData.scheduledTime) {
        const [hours, minutes] = formData.scheduledTime.split(':');
        const scheduledDateTime = new Date(formData.scheduledDate);
        scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
        scheduledTime = scheduledDateTime.toISOString();
      }

      const space = await createSpace({
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        privacy: formData.isPrivate ? 'private' : 'public',
        quality_threshold: formData.qualityThreshold[0],
        scheduled_time: scheduledTime,
        is_live: goLive,
        cover_image_url: coverImageUrl
      });

      if (space) {
        navigate(goLive ? `/space/${space.id}` : '/dashboard');
      }
    } catch (error) {
      console.error('Error creating space:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
      <div className="min-h-screen bg-background">
      <FloomHeader />
      
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Create Your Space
            </h1>
            <p className="text-muted-foreground">
              Start a conversation that matters
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
              {/* Basic Details */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5" />
                    Space Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Space Title *</Label>
                    <Input
                      id="title"
                      placeholder="What's your space about?"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your space..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-background min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Topic Tags</Label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {topicTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={formData.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer transition-all hover:scale-105 text-xs"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-sm text-muted-foreground">Selected:</span>
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                            <X 
                              className="w-3 h-3 ml-1 cursor-pointer" 
                              onClick={() => toggleTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cover Image Upload */}
                  <div className="space-y-2">
                    <Label>Cover Image (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      {coverImagePreview ? (
                        <div className="relative">
                          <img 
                            src={coverImagePreview} 
                            alt="Cover preview" 
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setCoverImage(null);
                              setCoverImagePreview(null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                          <div className="text-sm text-muted-foreground mb-2">
                            Upload a cover image for your space
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('cover-upload')?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image
                          </Button>
                          <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="w-5 h-5" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-2 text-sm">
                        {formData.isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        {formData.isPrivate ? 'Private' : 'Public'}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {formData.isPrivate 
                          ? 'Invite only' 
                          : 'Anyone can join'
                        }
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPrivate}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Quality Threshold: {formData.qualityThreshold[0]}%</Label>
                    <Slider
                      value={formData.qualityThreshold}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, qualityThreshold: value }))}
                      max={100}
                      step={10}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum score for speaker approval
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm">Schedule (Optional)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "justify-start text-left font-normal h-9",
                              !formData.scheduledDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.scheduledDate ? format(formData.scheduledDate, "MM/dd") : "Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.scheduledDate}
                            onSelect={(date) => setFormData(prev => ({ ...prev, scheduledDate: date }))}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                        <Input
                          type="time"
                          value={formData.scheduledTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                          className="pl-9 h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative p-4 border rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                      {/* Cover Image Preview */}
                      {coverImagePreview && (
                        <div className="absolute inset-0">
                          <img 
                            src={coverImagePreview} 
                            alt="Cover preview" 
                            className="w-full h-full object-cover opacity-40"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </div>
                      )}
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-base leading-tight text-white">
                            {formData.title || 'Your Space Title'}
                          </h3>
                          <Badge variant={formData.scheduledDate ? "outline" : "destructive"} className="ml-2 shrink-0">
                            {formData.scheduledDate ? 'Scheduled' : 'LIVE'}
                          </Badge>
                        </div>
                        
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {formData.tags.slice(0, 4).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                                #{tag}
                              </Badge>
                            ))}
                            {formData.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                                +{formData.tags.length - 4}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <p className="text-sm text-white/80 mb-4 line-clamp-2">
                          {formData.description || 'Space description will appear here...'}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 tabular-nums text-white/80">
                              <Users className="w-3 h-3" />
                              0
                            </span>
                            {formData.scheduledDate && formData.scheduledTime && (
                              <span className="flex items-center gap-1 tabular-nums text-white/80">
                                <Clock className="w-3 h-3" />
                                {formData.scheduledTime}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-white/80">
                            {formData.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                            <span>{formData.isPrivate ? 'Private' : 'Public'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  className="w-full h-12 text-base font-semibold" 
                  onClick={() => handleCreate(true)}
                  disabled={!formData.title.trim() || isCreating}
                >
                  {isCreating ? 'Creating...' : 'Go Live Now'}
                </Button>
                
                {formData.scheduledDate && formData.scheduledTime && (
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base" 
                    onClick={() => handleCreate(false)}
                    disabled={!formData.title.trim() || isCreating}
                  >
                    {isCreating ? 'Scheduling...' : 'Schedule Space'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateSpace;