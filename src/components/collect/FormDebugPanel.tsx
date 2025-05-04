
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Share, ArrowRightLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { syncDesignToPublicForm } from '@/services/syncPublicFormData';
import { useUserRole } from "@/hooks/useUserRole";

interface FormDebugPanelProps {
  projectId: string | null;
}

const FormDebugPanel: React.FC<FormDebugPanelProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const { isSuperAdmin } = useUserRole();
  
  // Don't render in production or if user is not a superadmin
  if (process.env.NODE_ENV === 'production' || !isSuperAdmin()) {
    return null;
  }
  
  const handleSync = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project ID available for synchronization",
        variant: "destructive"
      });
      return;
    }
    
    setIsSyncing(true);
    try {
      const success = await syncDesignToPublicForm(projectId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Successfully synchronized form data to public form",
        });
      } else {
        toast({
          title: "Warning",
          description: "No data available to synchronize",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error syncing form data:", error);
      toast({
        title: "Error",
        description: "Failed to synchronize form data",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <Card className="bg-amber-50 border-amber-200 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-amber-800">Form Debug Panel</h3>
            <p className="text-xs text-amber-700 mt-1">Use these tools to troubleshoot form display issues</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
              onClick={handleSync}
              disabled={isSyncing || !projectId}
            >
              {isSyncing ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <ArrowRightLeft className="h-3 w-3 mr-1" />
              )}
              Sync Design → Public Form
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              asChild
            >
              <a 
                href={`/form/${projectId}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Share className="h-3 w-3 mr-1" />
                View Public Form
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormDebugPanel;
