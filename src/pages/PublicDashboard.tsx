import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { validateDashboardToken } from "@/services/dashboardTokenService";
import SliderInsightsSection from "@/components/dashboard/SliderInsightsSection";
import StatsSection from "@/components/dashboard/StatsSection";
import ChartsSection from "@/components/dashboard/ChartsSection";
import PatternInsightsCard from "@/components/dashboard/PatternInsightsCard";
import SliderComparisonChart from "@/components/dashboard/SliderComparisonChart";
import WordCloudSection from "@/components/dashboard/WordCloudSection";
import ContourChartSection from "@/components/dashboard/ContourChartSection";
import NetworkDiagramSection from "@/components/dashboard/NetworkDiagramSection";
import { Project } from "@/types/project";
import { Story } from "@/types/story";
import { fetchStoriesForProject } from "@/services/story";

const PublicDashboard = () => {
  const { token } = useParams<{ token: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setInvalidToken(true);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const projectId = await validateDashboardToken(token);
        
        if (!projectId) {
          console.log("Invalid or expired token");
          setInvalidToken(true);
          setLoading(false);
          return;
        }
        
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (projectData) {
          setProject(projectData);
          
          setLoadingStories(true);
          try {
            const fetchedStories = await fetchStoriesForProject(projectId);
            setStories(fetchedStories);
          } catch (error) {
            console.error("Error fetching stories for public dashboard:", error);
          } finally {
            setLoadingStories(false);
          }
        } else {
          setInvalidToken(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error validating token:", error);
        setInvalidToken(true);
        setLoading(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  const totalStories = stories.length;
  const positiveStories = stories.filter(s => s.feelingSentiment === "positive").length;
  const neutralStories = stories.filter(s => s.feelingSentiment === "neutral").length;
  const negativeStories = stories.filter(s => s.feelingSentiment === "negative").length;
  
  const feelingData = [
    { name: "Positive", value: positiveStories },
    { name: "Neutral", value: neutralStories },
    { name: "Negative", value: negativeStories },
  ].filter(item => item.value > 0);
  
  if (loading || loadingStories) {
    return (
      <PageLayout simplified>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <span className="text-primary">Loading dashboard...</span>
        </div>
      </PageLayout>
    );
  }

  if (invalidToken || !project) {
    return (
      <PageLayout simplified>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Invalid or Expired Link</h1>
          <p className="text-gray-600">This dashboard link is invalid or has been revoked.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout simplified>
      <div className="container mx-auto py-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full inline-block mb-2">Public Dashboard</div>
              <h1 className="text-3xl font-bold text-primary mb-4">Project Dashboard: {project.name}</h1>
              <p className="text-gray-600 max-w-3xl">
                Analyze patterns and insights from stories collected for this project. This dashboard provides 
                a high-level overview of story collection efforts.
              </p>
            </div>
          </div>
        </div>
        
        {stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <h2 className="text-xl font-medium mb-2">No Stories Available</h2>
            <p className="text-gray-500">There are no stories available for this project yet.</p>
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
                <WordCloudSection stories={stories} isLoading={loadingStories} />
              </div>
            </div>
            
            <div className="mb-8">
              <SliderInsightsSection 
                stories={stories} 
                isLoading={loadingStories} 
                isPublic={true}
                projectId={project.id}
              />
            </div>
            
            <div className="mb-8">
              <SliderComparisonChart stories={stories} />
            </div>
            
            <div className="mb-8">
              <ContourChartSection stories={stories} isLoading={loadingStories} />
            </div>
            
            <div className="mb-8">
              <NetworkDiagramSection stories={stories} isLoading={loadingStories} />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <PatternInsightsCard 
                stories={stories} 
                projectName={project?.name || ""}
              />
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default PublicDashboard;
