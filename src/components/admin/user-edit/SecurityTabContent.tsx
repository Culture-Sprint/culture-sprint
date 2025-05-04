
import React from "react";
import { User } from "@/types/user";
import UserPasswordReset from "../UserPasswordReset";

interface SecurityTabContentProps {
  user: User;
  currentUser: User;
  onClose: () => void;
}

const SecurityTabContent: React.FC<SecurityTabContentProps> = ({ 
  user, 
  currentUser, 
  onClose 
}) => {
  const isSuperAdmin = () => {
    return currentUser.roles.includes('superadmin');
  };

  return (
    <>
      {isSuperAdmin() && currentUser.id === user.id ? (
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm text-muted-foreground">
            For security reasons, you cannot reset your own password as a superadmin through this interface.
            Please use the profile page to change your password.
          </p>
        </div>
      ) : (
        <UserPasswordReset 
          userId={currentUser.id} 
          userEmail={currentUser.email}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default SecurityTabContent;
