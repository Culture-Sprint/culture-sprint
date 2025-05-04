
import React from "react";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

interface DebugDialogTriggerProps {
  onClick?: () => void;
}

const DebugDialogTrigger: React.FC<DebugDialogTriggerProps> = ({ onClick }) => {
  const { isSuperAdmin } = useUserRole();
  
  // Only render the button if user is a superadmin
  if (!isSuperAdmin()) {
    return null;
  }
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1 text-orange-600 border-orange-200 hover:bg-orange-50"
      onClick={onClick}
    >
      <Bug className="h-4 w-4" />
      <span>Debug AI</span>
    </Button>
  );
};

export default DebugDialogTrigger;
