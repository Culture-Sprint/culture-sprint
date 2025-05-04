
import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import ErrorBoundaryLayout from "@/components/layout/ErrorBoundaryLayout";
import { useProject } from "@/contexts/ProjectContext";
import useStories from "@/hooks/useStories";
import SliderInsightsSection from "@/components/dashboard/SliderInsightsSection";
import StatsSection from "@/components/dashboard/StatsSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import PatternInsightsCard from "@/components/dashboard/PatternInsightsCard";
import SliderComparisonChart from "@/components/dashboard/SliderComparisonChart";
import WordCloudSection from "@/components/dashboard/WordCloudSection";
import ShareDashboardSection from "@/components/dashboard/ShareDashboardSection";
import NetworkDiagramSection from "@/components/dashboard/NetworkDiagramSection";
import ContourChartSection from "@/components/dashboard/ContourChartSection";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Button } from "@/components/ui/button";
import { SuccessFeedback } from "@/components/ui/success-feedback";
import useFeedback from "@/hooks/useFeedback";

const Dashboard = () => {
  const {
    activeProject
  } = useProject();
  
  const {
    stories,
    isLoading,
    refetch,
    error: storiesError
  } = useStories();
  
  // Use the feedback hook
  const { showSuccess, showError } = useFeedback("Dashboard");
  
  // Track any load errors
  const [loadError, setLoadError] = useState<Error | null>(null);
  
  // Track dashboard loading state
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  
  // Track successful data load
  const [dataLoaded, setDataLoaded] = useState(false);
  
  useEffect(() => {
    console.log("Dashboard rendering with:", {
      storiesCount: stories.length,
      isLoading,
      projectName: activeProject?.name,
      hasError: !!loadError
    });
    
    // Reset error state when project changes
    if (activeProject) {
      setLoadError(null);
      
      // Show feedback when data is loaded successfully
      if (stories.length > 0 && !isLoading && !dataLoaded) {
        setDataLoaded(true);
        if (stories.length > 10) {
          showSuccess(`${stories.length} stories loaded successfully`);
        }
      }
    }
  }, [activeProject, stories.length, isLoading, loadError, dataLoaded, showSuccess]);
  
  // Handle manual refresh with feedback
  const handleManualRefresh = async () => {
    try {
      setIsDashboardLoading(true);
      await refetch();
      showSuccess("Dashboard data refreshed successfully");
    } catch (error) {
      showError(error, "Failed to refresh dashboard data");
      setLoadError(error instanceof Error ? error : new Error("Unknown error occurred"));
    } finally {
      setIsDashboardLoading(false);
    }
  };
  
  // Calculate stats from stories
  const totalStories = stories.length;
  const positiveStories = stories.filter(s => s.feelingSentiment === "positive").length;
  const neutralStories = stories.filter(s => s.feelingSentiment === "neutral").length;
  const negativeStories = stories.filter(s => s.feelingSentiment === "negative").length;
  
  const feelingData = [
    { name: "Positive", value: positiveStories },
    { name: "Neutral", value: neutralStories },
    { name: "Negative", value: negativeStories }
  ].filter(item => item.value > 0);
  
  const recentStories = [...stories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  
  if (!activeProject) {
    return (
      <ErrorBoundaryLayout>
        <div className="container mx-auto py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">No Active Project</h1>
            <p className="text-gray-600">
              Please select or create a project to view dashboard analytics.
            </p>
          </div>
        </div>
      </ErrorBoundaryLayout>
    );
  }
  
  // Show error display if we couldn't load stories
  if (loadError || storiesError) {
    const error = loadError || storiesError;
    return (
      <ErrorBoundaryLayout>
        <div className="container mx-auto py-12">
          <ErrorDisplay
            severity="error"
            title="Dashboard Error"
            message="There was a problem loading your dashboard data."
            error={error}
            componentName="Dashboard"
            onRetry={handleManualRefresh}
            action={
              <Button 
                onClick={handleManualRefresh}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                disabled={isDashboardLoading}
              >
                {isDashboardLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </>
                )}
              </Button>
            }
          />
        </div>
      </ErrorBoundaryLayout>
    );
  }
  
  return (
    <ErrorBoundaryLayout>
      <div className="container mx-auto py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-bold text-primary mb-4 text-4xl">Project Dashboard: {activeProject?.name}</h1>
              <p className="text-gray-600 max-w-3xl">
                Analyze patterns and insights from stories collected for this project. This dashboard provides 
                a high-level overview of your story collection efforts.
              </p>
            </div>
            <div>
              <Button 
                onClick={handleManualRefresh} 
                variant="outline"
                disabled={isLoading || isDashboardLoading}
                className="flex items-center gap-2"
              >
                {(isLoading || isDashboardLoading) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading || isDashboardLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <span className="text-primary">Loading project data...</span>
          </div>
        ) : stories.length === 0 ? (
          <div className="py-8">
            <ErrorDisplay
              severity="info"
              title="No Data Available"
              message="No stories have been collected for this project yet. Start collecting stories to see insights here."
            />
          </div>
        ) : (
          <>
            <StatsSection 
              totalStories={totalStories} 
              positiveStories={positiveStories} 
              neutralStories={neutralStories} 
              negativeStories={negativeStories} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <ChartsSection 
                feelingData={feelingData} 
                totalStories={totalStories} 
                stories={stories} 
              />
              
              <div>
                <WordCloudSection stories={stories} isLoading={isLoading} />
              </div>
            </div>
            
            <div className="mb-8">
              <SliderInsightsSection stories={stories} isLoading={isLoading} />
            </div>
            
            <div className="mb-8">
              <SliderComparisonChart stories={stories} />
            </div>
            
            <div className="mb-8">
              <ContourChartSection stories={stories} isLoading={isLoading} />
            </div>
            
            <div className="mb-8">
              <NetworkDiagramSection stories={stories} isLoading={isLoading} />
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-8">
              <PatternInsightsCard stories={stories} projectName={activeProject?.name || ""} />
            </div>

            <ShareDashboardSection projectId={activeProject.id} projectName={activeProject.name} />
          </>
        )}
      </div>
    </ErrorBoundaryLayout>
  );
};

export default Dashboard;
