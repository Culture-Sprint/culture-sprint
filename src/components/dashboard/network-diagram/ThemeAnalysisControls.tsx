
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface ThemeAnalysisControlsProps {
  themeClustersCount: number;
  isThemeAnalysisLoading: boolean;
  onAnalyzeThemes: () => void;
}

const ThemeAnalysisControls: React.FC<ThemeAnalysisControlsProps> = ({
  themeClustersCount,
  isThemeAnalysisLoading,
  onAnalyzeThemes
}) => {
  return (
    <div>
      <Button
        variant="default"
        size="sm"
        onClick={onAnalyzeThemes}
        disabled={isThemeAnalysisLoading}
        className="bg-[#7A0266] hover:bg-[#63014F] text-white"
      >
        {isThemeAnalysisLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            {themeClustersCount === 0 ? "Analyze Themes" : "Refresh Themes"}
          </>
        )}
      </Button>
    </div>
  );
};

export default ThemeAnalysisControls;
