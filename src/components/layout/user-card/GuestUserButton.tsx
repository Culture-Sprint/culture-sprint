
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuestUserButtonProps {
  collapsed: boolean;
}

const GuestUserButton: React.FC<GuestUserButtonProps> = ({ collapsed }) => {
  return (
    <Button 
      variant="default" 
      size="sm" 
      className={cn(
        collapsed ? "w-10 h-10 p-0" : "w-full",
        "bg-brand-primary hover:bg-brand-primary/90"
      )} 
      asChild
    >
      <Link to="/auth">
        {collapsed ? <User size={16} /> : "Sign In"}
      </Link>
    </Button>
  );
};

export default GuestUserButton;
