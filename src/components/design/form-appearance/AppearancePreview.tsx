
import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormAppearance } from "./types";
import { PreviewSkeleton } from "./FormAppearanceSkeleton";

interface AppearancePreviewProps {
  appearance: FormAppearance;
  isLoading?: boolean;
}

// Using memo to prevent unnecessary re-renders
const AppearancePreview: React.FC<AppearancePreviewProps> = memo(({ 
  appearance,
  isLoading = false
}) => {
  // Show the preview UI with loading indicators if data is loading
  if (isLoading) {
    return <PreviewSkeleton />;
  }
  
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Preview</div>
      <Card className="overflow-hidden border border-gray-200">
        <div 
          className="p-6 flex flex-col items-center gap-6" 
          style={{ backgroundColor: appearance.backgroundColor }}
        >
          {appearance.logoUrl && (
            <div className="max-w-[200px] max-h-[100px]">
              <img 
                src={appearance.logoUrl} 
                alt="Form logo" 
                className="max-h-[100px] w-auto object-contain"
              />
            </div>
          )}
          <div className="text-center space-y-2 max-w-[85%]">
            <h2 className="text-xl font-semibold">
              {appearance.headerText}
            </h2>
            <p className="text-sm text-gray-600">
              {appearance.subheaderText}
            </p>
          </div>
          <CardContent className="bg-white rounded-md p-4 w-full mt-4 border border-gray-200">
            <div className="space-y-4">
              <div className="h-24 bg-gray-100 rounded-md w-full"></div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-100 rounded-md w-full"></div>
                <div className="h-8 bg-gray-100 rounded-md w-full"></div>
              </div>
              <div className="pt-2">
                <div className="h-10 bg-indigo-100 rounded-md w-32"></div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
});

AppearancePreview.displayName = "AppearancePreview";

export default AppearancePreview;
