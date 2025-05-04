
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface StoryQuestionGeneratorProps {
  loading: boolean;
  error: string | null;
  onGenerate: (e: React.MouseEvent) => void;
}

const StoryQuestionGenerator: React.FC<StoryQuestionGeneratorProps> = ({ 
  loading, 
  error,
  onGenerate 
}) => {
  const handleGenerate = (e: React.MouseEvent) => {
    // Add a user-visible toast when generate is clicked
    toast({
      title: "Generating question",
      description: "Creating your story question based on project information...",
    });
    
    onGenerate(e);
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Let the AI assistant suggest story questions based on your project information.
        This will use information from your planning phase activities to create a question.
      </p>
      <Button 
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex items-center gap-2"
        variant={error ? "destructive" : "default"}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating question... (may take 30 seconds)
          </>
        ) : error ? (
          <>
            <AlertTriangle className="h-4 w-4" />
            Retry Generation
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Generate Story Question
          </>
        )}
      </Button>
      
      {loading && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
          <p className="font-medium">AI is working on your question</p>
          <p>This may take up to 30 seconds depending on server load. Please be patient.</p>
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          <p className="font-medium">Error generating question:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default StoryQuestionGenerator;
