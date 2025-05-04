
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GenerateFactorsButtonProps {
  onClick: () => void;
  loading: boolean;
}

const GenerateFactorsButton: React.FC<GenerateFactorsButtonProps> = ({
  onClick,
  loading
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onClick} 
            variant="outline" 
            size="sm" 
            disabled={loading} 
            className="flex items-center gap-1 bg-brand-tertiary text-slate-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate with AI</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-xs">Uses AI to generate questions based on project context and influencing factors. Remember to save after generating!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GenerateFactorsButton;
