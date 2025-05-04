
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserListSkeletonProps {
  count?: number;
}

const UserListSkeleton: React.FC<UserListSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserListSkeleton;
