import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { spacesApi, Space as ApiSpace, SpaceCreateData } from '@/services/spacesApi';
import { getRandomAvatar } from '@/utils/avatarUtils';

export interface Space {
  id: string;
  title: string;
  description: string;
  host_id: string;
  is_live: boolean;
  scheduled_time?: string;
  listener_count: number;
  duration?: number;
  tags: string[];
  privacy: 'public' | 'private';
  quality_threshold: number;
  created_at: string;
  updated_at: string;
  cover_image_url?: string;
  host?: {
    display_name?: string;
    handle?: string;
    avatar_url?: string;
  };
  participant_count: number;
  is_participant: boolean;
}

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all spaces from backend API
      const apiSpaces = await spacesApi.getSpaces();

      // Convert API spaces to frontend Space format
      const spacesWithFormatting: Space[] = apiSpaces.map((space) => ({
        id: space.id,
        title: space.title,
        description: space.description || '',
        host_id: space.host_id,
        is_live: space.is_live,
        scheduled_time: space.scheduled_time,
        listener_count: space.listener_count || 0,
        duration: space.duration || 0,
        tags: space.tags || [],
        privacy: (space.privacy as 'public' | 'private') || 'public',
        quality_threshold: space.quality_threshold || 50,
        created_at: space.created_at,
        updated_at: space.updated_at,
        cover_image_url: space.cover_image_url,
        host: {
          display_name: user && space.host_id === user.id 
            ? (user.user_metadata?.full_name || user.email?.split('@')[0] || 'You')
            : 'Host',
          handle: user && space.host_id === user.id
            ? (user.user_metadata?.user_name || user.email?.split('@')[0] || 'you')
            : 'host',
          avatar_url: user && space.host_id === user.id
            ? (user.user_metadata?.avatar_url || getRandomAvatar(user.id))
            : getRandomAvatar(space.host_id),
        },
        participant_count: space.participant_count || 0,
        is_participant: false, // TODO: Track participation
      }));

      setSpaces(spacesWithFormatting);
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch spaces');
    } finally {
      setLoading(false);
    }
  };

  const createSpace = async (spaceData: {
    title: string;
    description?: string;
    tags?: string[];
    privacy?: 'public' | 'private';
    quality_threshold?: number;
    scheduled_time?: string;
    is_live?: boolean;
    cover_image_url?: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a space",
        variant: "destructive",
      });
      return null;
    }

    try {
      const spaceCreateData: SpaceCreateData = {
        title: spaceData.title,
        description: spaceData.description || '',
        tags: spaceData.tags || [],
        privacy: spaceData.privacy || 'public',
        quality_threshold: spaceData.quality_threshold || 50,
        scheduled_time: spaceData.scheduled_time,
        is_live: spaceData.is_live || false,
        cover_image_url: spaceData.cover_image_url,
      };

      const createdSpace = await spacesApi.createSpace(spaceCreateData, user.id);

      toast({
        title: "Space created successfully!",
        description: `Your space "${spaceData.title}" has been created.`,
      });

      // Refresh spaces list
      fetchSpaces();
      
      return createdSpace;
    } catch (err) {
      console.error('Error creating space:', err);
      toast({
        title: "Failed to create space",
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: "destructive",
      });
      return null;
    }
  };

  const joinSpace = async (spaceId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join a space",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Check if already joined to prevent spam
      const space = spaces.find(s => s.id === spaceId);
      if (space?.is_participant) {
        return true; // Already joined, don't show toast again
      }

      // TODO: Implement backend endpoint for joining spaces
      // For now, just mark as joined without showing repeated toast
      setSpaces(prev => 
        prev.map(s => s.id === spaceId ? { ...s, is_participant: true } : s)
      );
      
      return true;
    } catch (err) {
      console.error('Error joining space:', err);
      toast({
        title: "Failed to join space",
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: "destructive",
      });
      return false;
    }
  };

  const leaveSpace = async (spaceId: string) => {
    if (!user) return false;

    try {
      // TODO: Implement backend endpoint for leaving spaces
      toast({
        title: "Left space",
        description: "You have left the space.",
      });

      // Refresh spaces to update participant status
      fetchSpaces();
      
      return true;
    } catch (err) {
      console.error('Error leaving space:', err);
      toast({
        title: "Failed to leave space",
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: "destructive",
      });
      return false;
    }
  };

  const updateSpaceStatus = async (spaceId: string, updates: Partial<SpaceCreateData>) => {
    if (!user) return false;

    try {
      await spacesApi.updateSpace(spaceId, updates, user.id);

      // Refresh spaces to get updated data
      fetchSpaces();
      
      return true;
    } catch (err) {
      console.error('Error updating space:', err);
      return false;
    }
  };

  // Fetch spaces on mount and when user changes
  useEffect(() => {
    fetchSpaces();
  }, [user]);

  return {
    spaces,
    loading,
    error,
    createSpace,
    joinSpace,
    leaveSpace,
    updateSpaceStatus,
    refetch: fetchSpaces,
  };
}