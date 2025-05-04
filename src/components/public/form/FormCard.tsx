
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormAppearance } from "@/components/design/form-appearance/types";
import { Skeleton } from "@/components/ui/skeleton";
import PublicFormContainer from "@/components/collect/public/PublicFormContainer";
import PublicFormContainer2 from "@/components/collect/public/PublicFormContainer2";

interface FormCardProps {
  formId?: string;
  projectId: string | null;
  appearance: FormAppearance | null;
  isReady: boolean;
  useNewImplementation: boolean;
}

const FormCard: React.FC<FormCardProps> = ({
  formId,
  projectId,
  appearance,
  isReady,
  useNewImplementation
}) => {
  // Clean appearance to avoid blob URLs
  const cleanAppearance = React.useMemo(() => {
    if (!appearance) return null;
    
    // Create a clean copy of appearance with blob URLs removed
    const clean = {...appearance};
    if (clean.logoUrl && clean.logoUrl.startsWith('blob:')) {
      // Remove blob URLs as they won't work in a public context
      clean.logoUrl = '';
    }
    return clean;
  }, [appearance]);

  return (
    <Card 
      className="shadow-md border-t-4 border-t-blue-500 overflow-hidden"
      style={{ backgroundColor: cleanAppearance?.backgroundColor || '#ffffff' }}
    >
      <CardHeader className="text-center relative pb-8">
        {cleanAppearance?.logoUrl && (
          <div className="flex justify-center mb-6">
            <img 
              src={cleanAppearance.logoUrl} 
              alt="Form logo" 
              className="max-w-[200px] max-h-[120px] object-contain"
              onError={(e) => {
                console.error("Error loading logo:", cleanAppearance.logoUrl);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        {appearance?.logoUrl && appearance.logoUrl.startsWith('blob:') && (
          <div className="flex flex-col items-center mb-6">
            <div className="bg-amber-50 border border-amber-300 text-amber-800 px-3 py-2 rounded text-sm">
              Logo unavailable - Using a temporary URL that won't work in this session
            </div>
          </div>
        )}
        
        <CardTitle className="text-2xl font-bold text-gray-900">
          {cleanAppearance?.headerText || 'Submit Your Story'}
        </CardTitle>
        <CardDescription className="text-gray-600 mt-1 text-base">
          {cleanAppearance?.subheaderText || 'Share your experience with us'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isReady ? (
          <>
            {useNewImplementation ? (
              <PublicFormContainer2 formId={formId} projectId={projectId} />
            ) : (
              <PublicFormContainer formId={formId} projectId={projectId} />
            )}
          </>
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormCard;
