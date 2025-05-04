
import React, { useEffect, useState } from "react";
import FormDebugPanel from "@/components/collect/FormDebugPanel";
import UnifiedLoaderToggle from "./UnifiedLoaderToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { checkPublicFormAccess } from "@/services/supabaseSync/operations/core/rlsUtils";

interface DebugSectionProps {
  projectId: string | null;
  useUnifiedLoader: boolean;
  toggleLoader: () => void;
}

const DebugSection: React.FC<DebugSectionProps> = ({
  projectId,
  useUnifiedLoader,
  toggleLoader
}) => {
  const [publicAccessStatus, setPublicAccessStatus] = useState<boolean | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  
  // Check public form access when the component mounts or projectId changes
  useEffect(() => {
    const checkAccess = async () => {
      if (!projectId) {
        setPublicAccessStatus(null);
        return;
      }
      
      setIsCheckingAccess(true);
      try {
        const hasAccess = await checkPublicFormAccess(projectId);
        console.log(`Debug: Public form access for project ${projectId}: ${hasAccess ? 'Enabled' : 'Disabled'}`);
        setPublicAccessStatus(hasAccess);
      } catch (error) {
        console.error("Error checking public form access:", error);
        setPublicAccessStatus(false);
      } finally {
        setIsCheckingAccess(false);
      }
    };
    
    checkAccess();
  }, [projectId]);
  
  const handleCheckAccess = () => {
    if (projectId) {
      setIsCheckingAccess(true);
      checkPublicFormAccess(projectId)
        .then(result => setPublicAccessStatus(result))
        .catch(err => {
          console.error("Error checking access:", err);
          setPublicAccessStatus(false);
        })
        .finally(() => setIsCheckingAccess(false));
    }
  };
  
  return (
    <div className="mb-4 space-y-4">
      <FormDebugPanel projectId={projectId} />
      
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium flex items-center gap-2">
                Public Form Access: 
                {publicAccessStatus === null ? (
                  <span className="text-gray-500">Checking...</span>
                ) : publicAccessStatus ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Enabled
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Disabled
                  </span>
                )}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCheckAccess}
                disabled={isCheckingAccess}
              >
                {isCheckingAccess ? 'Checking...' : 'Check Access'}
              </Button>
            </div>
            
            <UnifiedLoaderToggle 
              useUnifiedLoader={useUnifiedLoader} 
              toggleLoader={toggleLoader} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugSection;
