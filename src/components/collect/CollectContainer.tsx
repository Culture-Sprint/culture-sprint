
import React, { useState, useEffect, useRef } from "react";
import CollectHeader from "@/components/collect/CollectHeader";
import { useProject } from "@/contexts/ProjectContext";
import { useFormDataFetcher } from "@/hooks/collect/useFormDataFetcher";
import { useUserRole } from "@/hooks/useUserRole";
import { clearLastLoadedProjectId } from "@/services/cache/projectCache";
import FormLoadingState from "./FormLoadingState";
import { useUnifiedFormDataLoader } from "@/hooks/collect/useUnifiedFormDataLoader";
import { useToast } from "@/components/ui/use-toast";
import DebugSection from "./components/DebugSection";
import CollectFormCard from "./components/CollectFormCard";
import ShareFormCard from "./components/ShareFormCard";
import LoaderControlsLoading from "./components/LoaderControlsLoading";

const CollectContainer: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [useUnifiedLoader, setUseUnifiedLoader] = useState(false);
  const { activeProject } = useProject();
  const projectId = activeProject?.id || null;
  const { isSuperAdmin } = useUserRole();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [stableLoading, setStableLoading] = useState(true);

  // Use the hook to fetch form data for the active project
  const {
    storyQuestion,
    sliderQuestions,
    participantQuestions,
    isLoading: isLegacyLoading,
    reloadFromRemote: legacyReloadFromRemote
  } = useFormDataFetcher(projectId);
  
  // Use the new unified loader for comparison
  const {
    storyQuestion: unifiedStoryQuestion,
    sliderQuestions: unifiedSliderQuestions,
    participantQuestions: unifiedParticipantQuestions,
    isLoading: isUnifiedLoading,
    reloadFromRemote: unifiedReloadFromRemote
  } = useUnifiedFormDataLoader(projectId);
  
  // Use the values from the selected loader
  const currentStoryQuestion = useUnifiedLoader ? unifiedStoryQuestion : storyQuestion;
  const currentSliderQuestions = useUnifiedLoader ? unifiedSliderQuestions : sliderQuestions;
  const currentParticipantQuestions = useUnifiedLoader ? unifiedParticipantQuestions : participantQuestions;
  const isCurrentLoading = useUnifiedLoader ? isUnifiedLoading : isLegacyLoading;
  const currentReloadFromRemote = useUnifiedLoader ? unifiedReloadFromRemote : legacyReloadFromRemote;
  
  // Add a timeout to prevent flickering on status changes
  useEffect(() => {
    // Clear any existing timeout when loading state changes
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    if (isCurrentLoading) {
      // Set stable loading immediately when we start loading
      setStableLoading(true);
    } else {
      // Delay removing the loading state to prevent flickering
      loadingTimeoutRef.current = setTimeout(() => {
        setStableLoading(false);
      }, 300); // Add a small delay before hiding the loading state
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isCurrentLoading]);
  
  // Force initial reload from remote when the collect page loads
  useEffect(() => {
    if (projectId && currentReloadFromRemote && isInitialLoad) {
      console.log("CollectContainer: Initial load - forcing fresh data fetch for project", projectId);
      
      // Clear last loaded project ID to ensure we don't use cached data
      clearLastLoadedProjectId();
      
      // Reload data from remote source
      currentReloadFromRemote();
      setIsInitialLoad(false);
    }
  }, [projectId, currentReloadFromRemote, isInitialLoad]);
  
  // Debug the participant questions
  useEffect(() => {
    console.log("CollectContainer - Questions loaded:", {
      loaderType: useUnifiedLoader ? "Unified" : "Legacy",
      storyQuestion: currentStoryQuestion ? "Present" : "Missing",
      sliderQuestionsCount: currentSliderQuestions?.length || 0,
      participantQuestionsCount: currentParticipantQuestions?.length || 0,
      isLoading: isCurrentLoading,
      sliderQuestions: currentSliderQuestions?.map(q => ({id: q.id, question: q.question?.substring(0, 30)}))
    });
  }, [currentParticipantQuestions, currentSliderQuestions, currentStoryQuestion, isCurrentLoading, useUnifiedLoader]);
  
  // Function to force a refresh of the form
  const handleForceRefresh = () => {
    console.log("Forcing refresh of form data from database");
    if (currentReloadFromRemote) {
      // Clear last loaded project ID before reloading
      clearLastLoadedProjectId();
      currentReloadFromRemote();
    } else {
      setRefreshTrigger(prev => prev + 1);
    }
  };

  // Toggle between legacy and unified loaders
  const toggleLoader = () => {
    setUseUnifiedLoader(prev => !prev);
    // Force a refresh when switching loaders
    setRefreshTrigger(prev => prev + 1);
    
    toast({
      title: `${useUnifiedLoader ? "Legacy" : "Unified"} Form Loader Activated`,
      description: `Switched to ${useUnifiedLoader ? "legacy" : "unified"} form data loading implementation.`,
      variant: "default"
    });
  };

  // If we're still loading the form data, show a loading state
  if (stableLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <CollectHeader />
        <FormLoadingState />
        
        {/* Loader toggle during loading state */}
        <LoaderControlsLoading 
          useUnifiedLoader={useUnifiedLoader}
          toggleLoader={toggleLoader}
          isSuperAdmin={isSuperAdmin()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <CollectHeader />
      
      {/* Debug panel and controls - only visible to superadmins */}
      {isSuperAdmin() && (
        <DebugSection 
          projectId={projectId}
          useUnifiedLoader={useUnifiedLoader}
          toggleLoader={toggleLoader}
        />
      )}
      
      <CollectFormCard 
        projectId={projectId}
        refreshTrigger={refreshTrigger}
        useUnifiedLoader={useUnifiedLoader}
        handleForceRefresh={handleForceRefresh}
      />
      
      <ShareFormCard 
        projectId={projectId}
        storyQuestion={currentStoryQuestion} 
        sliderQuestions={currentSliderQuestions} 
        participantQuestions={currentParticipantQuestions}
      />
    </div>
  );
};

export default CollectContainer;
