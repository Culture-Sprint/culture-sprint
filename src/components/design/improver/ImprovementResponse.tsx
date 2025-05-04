
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

interface ImprovementResponseProps {
  response: string;
  onAccept: () => void;
  loading?: boolean;
}

const ImprovementResponse: React.FC<ImprovementResponseProps> = ({
  response,
  onAccept,
  loading = false
}) => {
  if (!response) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-md">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-amber-800">Improved Question:</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
          onClick={onAccept}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              Accept
            </>
          )}
        </Button>
      </div>
      <div className="text-gray-700 whitespace-pre-wrap">{response}</div>
    </div>
  );
};

export default ImprovementResponse;
