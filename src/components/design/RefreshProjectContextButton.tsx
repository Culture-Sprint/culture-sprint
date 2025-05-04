
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useProjectContextRefresh } from "@/hooks/useProjectContextRefresh";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUserRole } from "@/hooks/useUserRole";

interface RefreshProjectContextButtonProps {
  className?: string;
}

const RefreshProjectContextButton: React.FC<RefreshProjectContextButtonProps> = ({ 
  className = "" 
}) => {
  const { refreshProjectContext, isRefreshing } = useProjectContextRefresh();
  const { isSuperAdmin } = useUserRole();
  
  // Only render the button if user is a superadmin
  if (!isSuperAdmin()) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 ${className}`}
            onClick={refreshProjectContext}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? "Clearing Cache..." : "Refresh Context"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>Completely clear all cached project data and rebuild the context from the database. This will reload the page.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RefreshProjectContextButton;
