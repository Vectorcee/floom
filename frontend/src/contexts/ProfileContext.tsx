import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getRandomAvatar } from '@/utils/avatarUtils';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  banner: string;
}

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveProfile: () => Promise<void>;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Anonymous User',
    username: 'user',
    bio: '',
    avatar: '',
    banner: ''
  });

  // Initialize profile when user changes
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          // Try to load from Supabase profiles table
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (profileData && !error) {
            setProfile({
              name: profileData.display_name || user.email?.split('@')[0] || 'Anonymous User',
              username: profileData.handle || user.email?.split('@')[0] || 'user',
              bio: profileData.bio || '',
              avatar: profileData.avatar_url || getRandomAvatar(user.id),
              banner: profileData.banner_url || ''
            });
          } else {
            // Fallback to user metadata
            const newProfile = {
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous User',
              username: user.user_metadata?.user_name || user.email?.split('@')[0] || 'user',
              bio: user.user_metadata?.bio || '',
              avatar: user.user_metadata?.avatar_url || getRandomAvatar(user.id),
              banner: user.user_metadata?.banner_url || ''
            };
            setProfile(newProfile);
            
            // Create initial profile in database
            await supabase
              .from('profiles')
              .upsert({
                user_id: user.id,
                display_name: newProfile.name,
                handle: newProfile.username,
                bio: newProfile.bio,
                avatar_url: newProfile.avatar,
                banner_url: newProfile.banner
              });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          // Fallback to basic profile
          setProfile({
            name: user.email?.split('@')[0] || 'Anonymous User',
            username: user.email?.split('@')[0] || 'user',
            bio: '',
            avatar: getRandomAvatar(user.id),
            banner: ''
          });
        }
      } else {
        // Reset profile when user logs out
        setProfile({
          name: 'Anonymous User',
          username: 'user',
          bio: '',
          avatar: getRandomAvatar(),
          banner: ''
        });
      }
    };

    loadProfile();
  }, [user]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update Supabase profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: profile.name,
          handle: profile.username,
          bio: profile.bio,
          avatar_url: profile.avatar,
          banner_url: profile.banner,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Also update user metadata for consistency
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.name,
          user_name: profile.username,
          bio: profile.bio,
          avatar_url: profile.avatar,
          banner_url: profile.banner
        }
      });

      if (metadataError) {
        console.error('Metadata update error:', metadataError);
        // Don't throw here - profile table update succeeded
      }

      // Store in localStorage for persistence
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));
      
      console.log('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    profile,
    updateProfile,
    saveProfile,
    isLoading
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}