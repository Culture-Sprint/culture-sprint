
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Loader2, RefreshCw } from "lucide-react";
import { useThemeAnalysis } from "./useThemeAnalysis";
import { useNetworkData } from "./useNetworkData";
import { NetworkDiagramSectionProps } from "./types";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FormErrorFallback } from "@/components/ui/form-error-fallback";
import ThemeAnalysisControls from "./ThemeAnalysisControls";
import NetworkVisualizer from "./NetworkVisualizer";
import { useToast } from "@/components/ui/use-toast";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Button } from "@/components/ui/button";

const NetworkDiagramSection: React.FC<NetworkDiagramSectionProps> = ({
  stories,
  isLoading,
}) => {
  const { themeClusters, isThemeAnalysisLoading, analyzeThemes, analysisError } = useThemeAnalysis(stories);
  const networkData = useNetworkData(stories, themeClusters);
  const { toast } = useToast();
  
  // Log important state changes for debugging
  useEffect(() => {
    console.log("NetworkDiagramSection state:", {
      themeClustersCount: themeClusters.length,
      isThemeAnalysisLoading,
      analysisError: analysisError ? true : false,
      networkDataCount: networkData.length
    });
  }, [themeClusters, isThemeAnalysisLoading, analysisError, networkData]);
  
  if (isLoading) {
    return (
      <Card className="shadow-md border border-[#7A0266] border-opacity-30">
        <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
          <div className="flex items-center gap-2">
            <CardTitle className="text-primary">
              <Network className="mr-2 h-5 w-5 inline" />
              Story Network Diagram
            </CardTitle>
            <InfoTooltip contentKey="dashboard-network-diagram" size={16} />
          </div>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center bg-gradient-to-b from-white to-culturesprint-50/20 rounded-b-md">
          <div className="text-gray-500">Loading network data...</div>
        </CardContent>
      </Card>
    );
  }
  
  if (!stories.length) {
    return (
      <Card className="shadow-md border border-[#7A0266] border-opacity-30">
        <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
          <div className="flex items-center gap-2">
            <CardTitle className="text-primary">
              <Network className="mr-2 h-5 w-5 inline" />
              Story Network Diagram
            </CardTitle>
            <InfoTooltip contentKey="dashboard-network-diagram" size={16} />
          </div>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center bg-gradient-to-b from-white to-culturesprint-50/20 rounded-b-md">
          <div className="text-gray-500">No stories available to visualize</div>
        </CardContent>
      </Card>
    );
  }
  
  const handleThemeAnalysis = async () => {
    try {
      console.log("Starting theme analysis...");
      const result = await analyzeThemes();
      console.log("Theme analysis result:", result);
      
      if (result && !result.error) {
        toast({
          title: "Theme Analysis Complete",
          description: `Identified ${result.themeClusters.length} themes in your stories.`,
        });
      } else if (result && result.error) {
        console.error("Theme analysis returned with error:", result.error);
        
        // Check for edge function error and display different toast
        if (result.error.message && result.error.message.includes("Edge function")) {
          toast({
            title: "Theme Analysis Needs Refresh",
            description: "Press the Refresh Themes button.",
            variant: "default"
          });
        } else {
          toast({
            title: "Theme Analysis Failed",
            description: result.error.message || "Could not analyze themes. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error during theme analysis:", error);
      toast({
        title: "Theme Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze themes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const retryButton = (
    <Button 
      onClick={handleThemeAnalysis}
      className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Retry Analysis
    </Button>
  );
  
  return (
    <Card className="shadow-md border border-[#7A0266] border-opacity-30">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-primary">
            <Network className="mr-2 h-5 w-5 inline" />
            Story Network Diagram
          </CardTitle>
          <InfoTooltip contentKey="dashboard-network-diagram" size={16} />
        </div>
        <ThemeAnalysisControls 
          themeClustersCount={themeClusters.length}
          isThemeAnalysisLoading={isThemeAnalysisLoading}
          onAnalyzeThemes={handleThemeAnalysis}
        />
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-white to-culturesprint-50/20 rounded-b-md">
        <ErrorBoundary
          fallback={
            <FormErrorFallback
              title="Network Visualization Error"
              message="There was a problem creating the network visualization."
              resetError={() => window.location.reload()}
            />
          }
          componentName="NetworkDiagram"
        >
          <NetworkVisualizer 
            networkData={networkData}
            themeClusters={themeClusters}
            isLoading={isThemeAnalysisLoading && themeClusters.length === 0}
            error={analysisError}
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};

export default NetworkDiagramSection;
