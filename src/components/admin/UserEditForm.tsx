
import React from "react";
import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import UserEditFormTabs from "./user-edit/UserEditFormTabs";

interface UserEditFormProps {
  user: User;
  onClose: () => void;
  onUserUpdate?: (updatedUser: User) => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ 
  user, 
  onClose, 
  onUserUpdate 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Edit User</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <UserEditFormTabs 
          user={user} 
          onUserUpdate={onUserUpdate} 
        />
      </CardContent>
    </Card>
  );
};

export default UserEditForm;
