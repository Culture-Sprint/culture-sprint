
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ProfilePictureSection from "../ProfilePictureSection";
import ProfileInfoForm from "../ProfileInfoForm";
import { ProfileFormValues } from "../ProfileInfoForm";

interface ProfileTabContentProps {
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
}

const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
  avatarUrl,
  useGravatar,
  uploading,
  loading,
  profileFormValues,
  handleAvatarUpload,
  switchToGravatar,
  getInitials,
  getAvatarSrc,
  userEmail,
  onProfileSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile information and profile picture.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfilePictureSection
          avatarUrl={avatarUrl}
          useGravatar={useGravatar}
          uploading={uploading}
          handleAvatarUpload={handleAvatarUpload}
          switchToGravatar={switchToGravatar}
          loading={loading}
          getInitials={getInitials}
          getAvatarSrc={getAvatarSrc}
          userEmail={userEmail}
        />

        <ProfileInfoForm
          defaultValues={profileFormValues}
          onSubmit={onProfileSubmit}
          loading={loading}
          userEmail={userEmail}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileTabContent;
