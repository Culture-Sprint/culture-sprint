
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ 
  searchTerm, 
  onSearchChange,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search users..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default UserSearchBar;
