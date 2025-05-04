
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

interface CollapsedUserCardProps {
  user: any;
  avatarUrl: string | null;
  getUserInitial: () => string;
  goToProfile: () => void;
  isAdmin: () => boolean;
  isSuperUser: () => boolean;
  isDemo: boolean;
  signOut: () => void;
}

const CollapsedUserCard: React.FC<CollapsedUserCardProps> = ({
  user,
  avatarUrl,
  getUserInitial,
  goToProfile,
  isAdmin,
  isSuperUser,
  isDemo,
  signOut
}) => {
  if (!user) {
    return (
      <Button 
        variant="default" 
        size="sm" 
        className="w-10 h-10 p-0 bg-brand-primary hover:bg-brand-primary/90" 
        asChild
      >
        <Link to="/auth">
          <User size={16} />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden p-0 hover:bg-brand-primary/10 transition-all duration-200 hover:scale-105 hover:shadow-md">
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatarUrl || undefined} alt={getUserInitial()} />
              <AvatarFallback className="bg-brand-primary/20 text-brand-primary">{getUserInitial()}</AvatarFallback>
            </Avatar>
            {(isAdmin() || isSuperUser() || isDemo) ? (
              <div className={`absolute top-0 right-0 h-2 w-2 rounded-full ${isDemo ? "bg-amber-500" : "bg-brand-secondary"}`} 
                aria-label={isDemo ? "Demo User" : "Admin status"}></div>
            ) : null}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={goToProfile} className="cursor-pointer hover:bg-brand-primary/10">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
          {isDemo ? (
            <div className="ml-auto h-2 w-2 bg-amber-500 rounded-full" aria-label="Demo user"></div>
          ) : isSuperUser() ? (
            <div className="ml-auto h-2 w-2 bg-brand-secondary rounded-full" aria-label="Admin status"></div>
          ) : null}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="flex flex-col items-start">
          <span>Signed in as</span>
          <span className="font-medium">{user.email}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => signOut()} 
          className="text-brand-secondary cursor-pointer hover:bg-brand-secondary/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollapsedUserCard;
