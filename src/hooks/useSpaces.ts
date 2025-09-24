import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Space {
  id: string;
  title: string;
  description?: string;
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
  host?: {
    display_name?: string;
    handle?: string;
    avatar_url?: string;
  };
  participant_count?: number;
  is_participant?: boolean;
}

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      
      // Fetch spaces with host profile information
      const { data: spacesData, error: spacesError } = await supabase
        .from('spaces')
        .select(`
          *,
          profiles (
            display_name,
            handle,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (spacesError) {
        throw spacesError;
      }

      // Get participant counts and check if current user is a participant
      const spacesWithParticipants = await Promise.all(
        (spacesData || []).map(async (space) => {
          // Get participant count
          const { count } = await supabase
            .from('space_participants')
            .select('*', { count: 'exact' })
            .eq('space_id', space.id);

          // Check if current user is a participant
          let isParticipant = false;
          if (user) {
            const { data: participantData } = await supabase
              .from('space_participants')
              .select('id')
              .eq('space_id', space.id)
              .eq('user_id', user.id)
              .single();
            
            isParticipant = !!participantData;
          }

          return {
            id: space.id,
            title: space.title,
            description: space.description,
            host_id: space.host_id,
            is_live: space.is_live,
            scheduled_time: space.scheduled_time,
            listener_count: space.listener_count,
            duration: space.duration,
            tags: space.tags || [],
            privacy: space.privacy as 'public' | 'private',
            quality_threshold: space.quality_threshold,
            created_at: space.created_at,
            updated_at: space.updated_at,
            host: space.profiles as { display_name?: string; handle?: string; avatar_url?: string } | undefined,
            participant_count: count || 0,
            is_participant: isParticipant,
          };
        })
      );

      setSpaces(spacesWithParticipants);
      setError(null);
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
    refetch: fetchSpaces,
  };
}