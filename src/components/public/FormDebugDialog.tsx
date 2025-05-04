
import React from "react";
import { FormAppearance } from "@/components/design/form-appearance/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserRole } from "@/hooks/useUserRole";

interface FormDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId?: string;
  projectId: string | null;
  resolvingProjectId: boolean;
  projectResolutionError: string | null;
  appearance: FormAppearance;
  debugInfo: any;
}

const FormDebugDialog: React.FC<FormDebugDialogProps> = ({
  open,
  onOpenChange,
  formId,
  projectId,
  resolvingProjectId,
  projectResolutionError,
  appearance,
  debugInfo
}) => {
  const { isSuperAdmin } = useUserRole();
  
  // Don't render the dialog if user is not a superadmin
  if (!isSuperAdmin()) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Form Appearance Debug</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-xs">
          <h3 className="font-bold">Form ID and Project Resolution</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify({
              formId,
              projectId, 
              isResolving: resolvingProjectId, 
              resolutionError: projectResolutionError
            }, null, 2)}
          </pre>
          
          <h3 className="font-bold">Appearance Data</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(appearance, null, 2)}
          </pre>
          
          <h3 className="font-bold">Full Debug Info</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormDebugDialog;
