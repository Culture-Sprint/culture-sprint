
import React, { useState } from 'react';
import UsersList from './UsersList';
import { User } from '@/types/user';

/**
 * Wrapper component for UsersList that provides the required props
 */
const AdminUserListWrapper: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const handleUserUpdate = (updatedUser: User) => {
    setSelectedUser(updatedUser);
  };

  return (
    <UsersList 
      onSelectUser={setSelectedUser} 
      selectedUser={selectedUser}
      onUserUpdate={handleUserUpdate}
    />
  );
};

export default AdminUserListWrapper;
