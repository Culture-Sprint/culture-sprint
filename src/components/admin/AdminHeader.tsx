
import React from "react";
import { Shield } from "lucide-react";

const AdminHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Shield className="h-8 w-8 text-brand-primary" />
      <div>
        <h1 className="text-3xl font-bold">User Administration</h1>
        <p className="text-muted-foreground mt-1">Manage users and their roles</p>
      </div>
    </div>
  );
};

export default AdminHeader;
