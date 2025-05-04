
import React from "react";
import { Button } from "@/components/ui/button";

interface CheckDatabaseButtonProps {
  onCheckDatabase: () => Promise<void>;
  isChecking: boolean;
}

const CheckDatabaseButton: React.FC<CheckDatabaseButtonProps> = ({
  onCheckDatabase,
  isChecking
}) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onCheckDatabase}
      disabled={isChecking}
      className="text-xs h-7 px-2"
    >
      {isChecking ? 'Checking...' : 'Check DB Directly'}
    </Button>
  );
};

export default CheckDatabaseButton;
