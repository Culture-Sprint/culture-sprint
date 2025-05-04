
import { User } from "@/types/user";

export const getUserDisplayName = (
  userData: { 
    full_name?: string; 
    username?: string; 
    avatar_url?: string 
  } | null, 
  user: { email?: string; user_metadata?: Record<string, any> }
): string => {
  if (userData?.full_name) return userData.full_name;
  
  const userMetadata = user.user_metadata;
  if (userMetadata?.full_name) return userMetadata.full_name;
  if (userMetadata?.name) return userMetadata.name;
  if (userData?.username) return userData.username;
  
  return "Your Profile";
};
