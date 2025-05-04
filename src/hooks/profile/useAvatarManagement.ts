
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useAvatarManagement = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user!.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
      
      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading picture",
        description: error.message || "An error occurred while uploading your profile picture.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const switchToGravatar = async () => {
    try {
      if (!user) return false;
      
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Using Gravatar",
        description: "Your profile is now using your Gravatar image.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error switching to Gravatar",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploading,
    handleAvatarUpload,
    switchToGravatar
  };
};
