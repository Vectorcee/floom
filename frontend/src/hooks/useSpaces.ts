import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { spacesApi, Space as ApiSpace, SpaceCreateData } from '@/services/spacesApi';
import { supabase } from '@/lib/supabase';

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
          display_name: space.host_id, // TODO: Get actual host info
          handle: space.host_id,
          avatar_url: undefined,
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
    tags: string[];
    privacy: 'public' | 'private';
    quality_threshold: number;
    scheduled_time?: string;
    is_live?: boolean;
    cover_image_url?: string | null;
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
      const { data, error } = await supabase
        .from('spaces')
        .insert({
          ...spaceData,
          host_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Space created successfully!",
        description: `Your space "${spaceData.title}" has been created.`,
      });

      // Refresh spaces list
      fetchSpaces();
      
      return data;
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
      const { error } = await supabase
        .from('space_participants')
        .insert({
          space_id: spaceId,
          user_id: user.id,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Joined space successfully!",
        description: "You are now participating in this space.",
      });

      // Refresh spaces to update participant status
      fetchSpaces();
      
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
      const { error } = await supabase
        .from('space_participants')
        .delete()
        .eq('space_id', spaceId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

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

  const updateSpaceStatus = async (spaceId: string, updates: Partial<Space>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('spaces')
        .update(updates)
        .eq('id', spaceId)
        .eq('host_id', user.id); // Only host can update space

      if (error) {
        throw error;
      }

      // Refresh spaces to get updated data
      fetchSpaces();
      
      return true;
    } catch (err) {
      console.error('Error updating space:', err);
      return false;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchSpaces();

    // Subscribe to spaces changes
    const spacesSubscription = supabase
      .channel('spaces-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'spaces'
        },
        () => {
          fetchSpaces();
        }
      )
      .subscribe();

    // Subscribe to participants changes
    const participantsSubscription = supabase
      .channel('participants-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'space_participants'
        },
        () => {
          fetchSpaces();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(spacesSubscription);
      supabase.removeChannel(participantsSubscription);
    };
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