
import React from "react";
import { cn } from "@/lib/utils";
import { UserCard } from "../UserCard";

interface SidebarUserSectionProps {
  collapsed: boolean;
}

export const SidebarUserSection: React.FC<SidebarUserSectionProps> = ({ collapsed }) => {
  return (
    <div className={cn(
      "border-t border-sidebar-border p-4 bg-culturesprint-600/10",
      collapsed ? "flex justify-center" : ""
    )}>
      <UserCard collapsed={collapsed} />
    </div>
  );
};
