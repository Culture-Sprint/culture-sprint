
import React from "react";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getGravatarUrl, getUserInitials } from "@/utils/avatarUtils";

interface UserItemProps {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
  onUpdateUser?: (updatedUser: User) => void;
}

const UserItem: React.FC<UserItemProps> = ({ 
  user, 
  isSelected, 
  onSelect,
  onUpdateUser
}) => {
  const isAdmin = user.roles.includes('admin') || 
                 user.roles.includes('superadmin') || 
                 user.roles.includes('superuser');
  
  const isDemo = user.roles.includes('demo');
  
  const handleClick = () => {
    onSelect(user);
  };
  
  return (
    <div
      className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
        isSelected ? "bg-muted" : ""
      }`}
      onClick={handleClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatarUrl || getGravatarUrl(user.email)} />
        <AvatarFallback>{getUserInitials(user.fullName || user.email)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate flex items-center">
          {user.fullName || user.username || user.email.split("@")[0]}
          
          {isDemo && (
            <div className="h-2 w-2 bg-amber-500 rounded-full ml-2" aria-label="Demo user"></div>
          )}
          
          {isAdmin && (
            <div className="h-2 w-2 bg-brand-secondary rounded-full ml-2" aria-label="Admin status"></div>
          )}
        </div>
        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
      </div>
    </div>
  );
};

export default UserItem;
