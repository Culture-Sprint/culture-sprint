
import { useState, useEffect } from "react";
import { ProfileFormValues } from "@/components/profile/ProfileInfoForm";
import { PasswordFormValues } from "@/components/profile/PasswordChangeForm";
import { useProfileFetch } from "./profile/useProfileFetch";
import { useAvatarManagement } from "./profile/useAvatarManagement";
import { useProfileUpdate } from "./profile/useProfileUpdate";
import { useAIProviderSelection } from "./useAIProviderSelection";

export const useProfileData = () => {
  const { 
    user, 
    loading: fetchLoading, 
    profileData, 
    setProfileData 
  } = useProfileFetch();
  
  const { 
    uploading, 
    handleAvatarUpload: uploadAvatar, 
    switchToGravatar: switchToGravatarService 
  } = useAvatarManagement();
  
  const { 
    loading: updateLoading, 
    updateProfile, 
    updatePassword: updatePasswordService 
  } = useProfileUpdate();

  const [profileFormValues, setProfileFormValues] = useState<ProfileFormValues>({
    fullName: "",
    username: "",
  });

  const {
    provider: aiProvider,
    handleProviderChange: onAIProviderChange,
    handleSaveSettings: onAISettingsSubmit,
    isLoading: aiSettingsLoading
  } = useAIProviderSelection();

  useEffect(() => {
    setProfileFormValues({
      fullName: profileData.fullName,
      username: profileData.username,
    });
  }, [profileData]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAvatarUrl = await uploadAvatar(event);
    
    if (newAvatarUrl) {
      setProfileData({
        ...profileData,
        avatarUrl: newAvatarUrl,
        useGravatar: false
      });
    }
  };

  const switchToGravatar = async () => {
    const success = await switchToGravatarService();
    
    if (success) {
      setProfileData({
        ...profileData,
        avatarUrl: null,
        useGravatar: true
      });
    }
  };

  const onProfileSubmit = async (data: ProfileFormValues) => {
    const success = await updateProfile(data);
    
    if (success) {
      setProfileFormValues(data);
      setProfileData({
        ...profileData,
        fullName: data.fullName,
        username: data.username
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues): Promise<void> => {
    await updatePasswordService(data);
  };

  const loading = fetchLoading || updateLoading || aiSettingsLoading;

  return {
    user,
    loading,
    avatarUrl: profileData.avatarUrl,
    useGravatar: profileData.useGravatar,
    uploading,
    profileFormValues,
    handleAvatarUpload,
    switchToGravatar,
    onProfileSubmit,
    onPasswordSubmit,
    aiProvider,
    onAIProviderChange,
    onAISettingsSubmit,
  };
};
