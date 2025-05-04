
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ProfileData, ProfileRecord } from "./types";

export const useProfileFetch = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    username: "",
    avatarUrl: null,
    useGravatar: false,
    aiProvider: "openai" // Default to OpenAI
  });

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        console.log("Profile data loaded:", data);
        const profileRecord = data as ProfileRecord;
        setProfileData({
          fullName: profileRecord.full_name || "",
          username: profileRecord.username || "",
          avatarUrl: profileRecord.avatar_url,
          useGravatar: !profileRecord.avatar_url && !!user.email,
          aiProvider: profileRecord.ai_provider || "openai" // Use stored provider or default to OpenAI
        });
      } else {
        // If no profile exists, create one
        const userMetadata = user.user_metadata;
        const defaultName = userMetadata?.full_name || userMetadata?.name || "";
        
        setProfileData({
          fullName: defaultName,
          username: user.email ? user.email.split('@')[0] : "",
          avatarUrl: null,
          useGravatar: !!user.email,
          aiProvider: "openai" // Default to OpenAI for new profiles
        });
        
        console.log("No profile found, using defaults");
      }
    } catch (error: any) {
      console.error("Unexpected error loading user profile:", error);
      toast({
        title: "Error loading profile",
        description: "An unexpected error occurred while loading your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  return {
    user,
    loading,
    profileData,
    setProfileData,
    setLoading
  };
};
