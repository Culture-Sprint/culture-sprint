import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabNavigation from "./tabs/TabNavigation";
import ProfileTabContent from "./tabs/ProfileTabContent";
import SecurityTabContent from "./tabs/SecurityTabContent";
import AISettingsTabContent from "./tabs/AISettingsTabContent";
import CodeRedemptionTabContent from "./tabs/CodeRedemptionTabContent";
import { ProfileFormValues } from "./ProfileInfoForm";
import { PasswordFormValues } from "./PasswordChangeForm";

interface ProfileTabsProps {
  activeTab: "profile" | "security" | "ai-settings" | "upgrade";
  setActiveTab: (value: "profile" | "security" | "ai-settings" | "upgrade") => void;
  avatarUrl: string | null;
  useGravatar: boolean;
  uploading: boolean;
  loading: boolean;
  profileFormValues: ProfileFormValues;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  switchToGravatar: () => Promise<void>;
  getInitials: () => string;
  getAvatarSrc: () => string | undefined;
  userEmail: string | undefined;
  onProfileSubmit: (data: ProfileFormValues) => Promise<void>;
  onPasswordSubmit: (data: PasswordFormValues) => Promise<void>;
  aiProvider: string;
  onAIProviderChange: (provider: string) => void;
  onAISettingsSubmit: () => Promise<void>;
}

const ProfileTabs: React.FC<ProfileTabsProps> = (props) => {
  const {
    activeTab,
    setActiveTab,
    onPasswordSubmit,
    loading,
    aiProvider,
    onAIProviderChange,
    onAISettingsSubmit,
    ...profileTabProps
  } = props;

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "profile" | "security" | "ai-settings" | "upgrade")}>
      <TabNavigation 
        activeTab={activeTab} 
        onChange={(value) => setActiveTab(value)} 
      />

      <TabsContent value="profile" className="space-y-6 mt-6">
        <ProfileTabContent 
          {...profileTabProps}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="security" className="space-y-6 mt-6">
        <SecurityTabContent
          loading={loading}
          onPasswordSubmit={onPasswordSubmit}
        />
      </TabsContent>

      <TabsContent value="ai-settings" className="space-y-6 mt-6">
        <AISettingsTabContent
          aiProvider={aiProvider}
          onAIProviderChange={onAIProviderChange}
          loading={loading}
          onAISettingsSubmit={onAISettingsSubmit}
        />
      </TabsContent>

      <TabsContent value="upgrade" className="space-y-6 mt-6">
        <CodeRedemptionTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
