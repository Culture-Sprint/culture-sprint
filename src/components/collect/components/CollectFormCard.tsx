
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FormErrorFallback } from "@/components/ui/form-error-fallback";
import FormContainer from "@/components/collect/AuthenticatedFormContainer";
import { useUserRole } from "@/hooks/useUserRole";

interface CollectFormCardProps {
  projectId: string | null;
  refreshTrigger: number;
  useUnifiedLoader: boolean;
  handleForceRefresh: () => void;
}

const CollectFormCard: React.FC<CollectFormCardProps> = ({
  projectId,
  refreshTrigger,
  useUnifiedLoader,
  handleForceRefresh
}) => {
  const { isSuperAdmin } = useUserRole();

  return (
    <Card className="mb-6 border-opacity-50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-primary">Collect Stories</h2>
          <InfoTooltip contentKey="collect-story-form" size={16} />
        </div>
        
        {/* Only show the refresh button to superadmins */}
        {isSuperAdmin() && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleForceRefresh}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Form
          </Button>
        )}
      </CardHeader>
      <CardContent className="bg-white p-4">
        <ErrorBoundary
          fallback={
            <FormErrorFallback 
              title="Form Loading Error" 
              message="There was a problem loading the form. Please try refreshing the page."
              resetError={handleForceRefresh}
            />
          }
        >
          <FormContainer projectId={projectId} key={`form-container-${refreshTrigger}-${useUnifiedLoader}`} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};

export default CollectFormCard;
