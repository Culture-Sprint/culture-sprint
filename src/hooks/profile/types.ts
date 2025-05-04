
import { ProfileFormValues } from "@/components/profile/ProfileInfoForm";
import { PasswordFormValues } from "@/components/profile/PasswordChangeForm";

export interface ProfileData {
  fullName: string;
  username: string;
  avatarUrl: string | null;
  useGravatar: boolean;
  aiProvider?: string;
}

// Supabase profiles table schema type
export interface ProfileRecord {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  updated_at: string;
  created_at: string;
  ai_provider?: string; // Optional field that may not exist in all records
}
