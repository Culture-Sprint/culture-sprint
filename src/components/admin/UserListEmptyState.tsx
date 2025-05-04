
import React from "react";

const UserListEmptyState: React.FC = () => {
  return (
    <div className="p-4 text-center">
      <p className="text-muted-foreground">No users found</p>
    </div>
  );
};

export default UserListEmptyState;
