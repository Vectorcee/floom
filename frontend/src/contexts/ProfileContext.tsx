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
    if (user) {
      setProfile({
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous User',
        username: user.user_metadata?.user_name || user.email?.split('@')[0] || 'user',
        bio: user.user_metadata?.bio || '',
        avatar: user.user_metadata?.avatar_url || getRandomAvatar(user.id),
        banner: user.user_metadata?.banner_url || ''
      });
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
  }, [user]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // TODO: Implement actual save to backend/Supabase
      // For now, we'll store in localStorage and user metadata
      const profileData = {
        full_name: profile.name,
        user_name: profile.username,
        bio: profile.bio,
        avatar_url: profile.avatar,
        banner_url: profile.banner
      };

      // Store in localStorage for persistence
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));
      
      console.log('Profile saved:', profileData);
      // TODO: Update Supabase user metadata or profiles table
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