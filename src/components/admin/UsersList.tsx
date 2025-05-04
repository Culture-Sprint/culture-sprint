
import React from "react";
import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserSearchBar from "./UserSearchBar";
import UserItem from "./UserItem";
import UserListEmptyState from "./UserListEmptyState";
import UserListSkeleton from "./UserListSkeleton";
import { useAdminUsers } from "@/hooks/useAdminUsers";

interface UsersListProps {
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
  onUserUpdate?: (updatedUser: User) => void;
}

const UsersList: React.FC<UsersListProps> = ({ 
  onSelectUser, 
  selectedUser,
  onUserUpdate 
}) => {
  const { 
    filteredUsers, 
    loading, 
    searchTerm, 
    handleSearchChange,
    updateUser 
  } = useAdminUsers();
  
  // Handle user updates from children components
  const handleUserUpdate = (updatedUser: User) => {
    if (updateUser) {
      updateUser(updatedUser);
    }
    
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users ({filteredUsers.length})</CardTitle>
        <UserSearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
          loading={loading} 
        />
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {loading ? (
            <UserListSkeleton />
          ) : filteredUsers.length === 0 ? (
            <UserListEmptyState />
          ) : (
            filteredUsers.map((user) => (
              <UserItem 
                key={user.id} 
                user={user} 
                isSelected={selectedUser?.id === user.id}
                onSelect={onSelectUser}
                onUpdateUser={handleUserUpdate}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersList;
