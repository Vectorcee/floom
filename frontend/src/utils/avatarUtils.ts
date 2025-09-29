// Import all default avatars
import avatar1 from '@/assets/1.png';
import avatar2 from '@/assets/2.png';
import avatar3 from '@/assets/3.png';
import avatar4 from '@/assets/4.png';
import avatar5 from '@/assets/5.png';
import avatar6 from '@/assets/6.png';
import avatar7 from '@/assets/7.png';
import avatar8 from '@/assets/8.png';
import avatar9 from '@/assets/9.png';
import avatar10 from '@/assets/10.png';
import avatar11 from '@/assets/11.png';
import avatar12 from '@/assets/12.png';
import avatar13 from '@/assets/13.png';
import avatar14 from '@/assets/14.png';
import avatar15 from '@/assets/15.png';

const defaultAvatars = [
  avatar1, avatar2, avatar3, avatar4, avatar5,
  avatar6, avatar7, avatar8, avatar9, avatar10,
  avatar11, avatar12, avatar13, avatar14, avatar15
];

/**
 * Get a random default avatar for a user
 * Uses user ID as seed for consistent avatar assignment
 */
export const getRandomAvatar = (userId?: string): string => {
  if (!userId) {
    return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
  }
  
  // Use user ID as seed for consistent avatar
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % defaultAvatars.length;
  return defaultAvatars[index];
};

/**
 * Get all available default avatars
 */
export const getDefaultAvatars = (): string[] => {
  return defaultAvatars;
};

/**
 * Convert file to base64 for storage/preview
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, or WebP)' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  
  return { valid: true };
};