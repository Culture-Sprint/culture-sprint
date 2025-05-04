import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ExpandedUserCardProps {
  user: any;
  avatarUrl: string | null;
  getUserInitial: () => string;
  getDisplayName: () => string;
  isAdmin: () => boolean;
  isSuperUser: () => boolean;
  isDemo: boolean;
  goToProfile: () => void;
  signOut: () => void;
}

const ExpandedUserCard: React.FC<ExpandedUserCardProps> = ({
  user,
  avatarUrl,
  getUserInitial,
  getDisplayName,
  isAdmin,
  isSuperUser,
  isDemo,
  goToProfile,
  signOut
}) => {
  const getRoleIndicator = () => {
    if (isDemo) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-2 w-2 bg-amber-500 rounded-full ml-2" aria-label="Demo user"></div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Demo User</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (isAdmin() || isSuperUser()) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-2 w-2 bg-brand-secondary rounded-full ml-2" aria-label="Admin status"></div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Admin Access</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col space-y-3">
      <div 
        className="flex items-center gap-2 p-2 rounded-md hover:bg-brand-primary/10 cursor-pointer transition-all duration-200 hover:scale-102 hover:shadow-sm"
        onClick={goToProfile}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl || undefined} alt={getUserInitial()} />
          <AvatarFallback className="bg-brand-primary/20 text-brand-primary">{getUserInitial()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-medium text-sm">{getDisplayName()}</span>
            {getRoleIndicator()}
          </div>
          <span className="text-xs text-sidebar-foreground/60 truncate">{user.email}</span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => signOut()} 
        className="flex items-center gap-2 text-brand-secondary hover:text-white hover:bg-brand-secondary/90 w-full justify-start"
      >
        <LogOut size={16} />
        <span>Log out</span>
      </Button>
    </div>
  );
};

export default ExpandedUserCard;
