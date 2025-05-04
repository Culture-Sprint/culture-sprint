
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ProfileFormValues } from "@/components/profile/ProfileInfoForm";
import { PasswordFormValues } from "@/components/profile/PasswordChangeForm";

export const useProfileUpdate = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateProfile = async (data: ProfileFormValues & { aiProvider?: string }): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      const updates = {
        id: user.id,
        full_name: data.fullName,
        username: data.username,
        updated_at: new Date().toISOString(),
        ai_provider: data.aiProvider || null,
      };
      
      const { error } = await supabase
        .from("profiles")
        .upsert(updates, { onConflict: "id" });
      
      if (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error("Unexpected error updating profile:", error);
      toast({
        title: "Profile update failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data: PasswordFormValues): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to change your password",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) {
        console.error("Error updating password:", error);
        toast({
          title: "Password change failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error("Unexpected error updating password:", error);
      toast({
        title: "Password change failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateProfile,
    updatePassword,
  };
};
