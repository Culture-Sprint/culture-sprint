
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfilePictureSectionProps {
  avatarUrl: string | null;
  useGravatar: boolean;
  uploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  switchToGravatar: () => Promise<void>;
  loading: boolean;
  getInitials: () => string;
  getAvatarSrc: () => string | undefined;
  userEmail: string | undefined;
}

const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  avatarUrl,
  useGravatar,
  uploading,
  handleAvatarUpload,
  switchToGravatar,
  loading,
  getInitials,
  getAvatarSrc,
  userEmail
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={getAvatarSrc()} alt={getInitials()} />
          <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Profile Picture</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById("avatar-upload")?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Picture"}
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
            />
            {!useGravatar && (
              <Button
                variant="outline"
                size="sm"
                onClick={switchToGravatar}
                disabled={loading}
              >
                Use Gravatar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureSection;
