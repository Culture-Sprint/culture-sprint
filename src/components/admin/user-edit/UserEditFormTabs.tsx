
import React, { useState } from "react";
import { User } from "@/types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileForm from "./UserProfileForm";
import { UserRoles } from "../UserRoles";
import SecurityTabContent from "./SecurityTabContent";

interface UserEditFormTabsProps {
  user: User;
  onUserUpdate?: (updatedUser: User) => void;
  onTabChange?: (tab: string) => void;
}

const UserEditFormTabs: React.FC<UserEditFormTabsProps> = ({ 
  user, 
  onUserUpdate,
  onTabChange
}) => {
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  const handleRoleChange = (role: string) => {
    console.log(`Role changed to ${role} for user ${currentUser.id}`);
    
    const updatedUser = {
      ...currentUser,
      roles: [role]
    };
    
    setCurrentUser(updatedUser);
    
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="w-full mb-6">
        <TabsTrigger value="profile" className="flex-1">
          Profile Information
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex-1">
          User Roles
        </TabsTrigger>
        <TabsTrigger value="security" className="flex-1">
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <UserProfileForm 
          user={currentUser} 
          onUserUpdate={(updatedUser) => {
            setCurrentUser(updatedUser);
            if (onUserUpdate) {
              onUserUpdate(updatedUser);
            }
          }} 
        />
      </TabsContent>

      <TabsContent value="roles">
        <UserRoles user={currentUser} onRoleChange={handleRoleChange} />
      </TabsContent>

      <TabsContent value="security">
        <SecurityTabContent 
          user={user} 
          currentUser={currentUser} 
          onClose={() => handleTabChange("profile")} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserEditFormTabs;
