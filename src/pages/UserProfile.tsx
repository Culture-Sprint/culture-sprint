
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { getUserInitials, getGravatarUrl } from "@/utils/avatarUtils";
import { useProfileData } from "@/hooks/useProfileData";

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "ai-settings" | "upgrade">("profile");
  
  const {
    loading,
    avatarUrl,
    useGravatar,
    uploading,
    profileFormValues,
    handleAvatarUpload,
    switchToGravatar,
    onProfileSubmit,
    onPasswordSubmit,
    aiProvider,
    onAIProviderChange,
    onAISettingsSubmit,
  } = useProfileData();

  const getInitials = () => {
    return getUserInitials(profileFormValues.fullName, user?.email);
  };

  const getAvatarSrc = () => {
    if (useGravatar && user?.email) {
      return getGravatarUrl(user.email, 200);
    }
    return avatarUrl || undefined;
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <PageLayout>
      <div className="container max-w-3xl py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">User Profile</h1>
          </div>

          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            avatarUrl={avatarUrl}
            useGravatar={useGravatar}
            uploading={uploading}
            loading={loading}
            profileFormValues={profileFormValues}
            handleAvatarUpload={handleAvatarUpload}
            switchToGravatar={switchToGravatar}
            getInitials={getInitials}
            getAvatarSrc={getAvatarSrc}
            userEmail={user.email}
            onProfileSubmit={onProfileSubmit}
            onPasswordSubmit={onPasswordSubmit}
            aiProvider={aiProvider}
            onAIProviderChange={onAIProviderChange}
            onAISettingsSubmit={onAISettingsSubmit}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default UserProfile;
