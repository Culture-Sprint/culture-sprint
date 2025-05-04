
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface FormErrorDisplayProps {
  error: string;
  debugInfo?: any;
}

const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({
  error,
  debugInfo
}) => {
  return (
    <Card className="shadow-md border-t-4 border-t-red-500">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Error Loading Form
        </CardTitle>
        <CardDescription className="text-gray-600 mt-1 text-base">
          {error}
        </CardDescription>
      </CardHeader>
      {debugInfo && (
        <CardContent className="border-t pt-4">
          <details className="text-xs">
            <summary className="cursor-pointer font-medium mb-2">Debug Information</summary>
            <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-48">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </CardContent>
      )}
    </Card>
  );
};

export default FormErrorDisplay;
