
import React, { useEffect, useState } from "react";
import { FormProvider } from "@/contexts/form";
import { useFormDataLoader } from "@/hooks/collect/useFormDataLoader";
import { useFormSubmissionHandler } from "@/hooks/collect/useFormSubmissionHandler";
import EmptyFormState from "@/components/collect/EmptyFormState";
import FormLoadingState from "@/components/collect/FormLoadingState";
import StoryForm from "@/components/collect/StoryForm";
import { useStoryQuestion } from "@/hooks/useStoryQuestion";
import { StoryData } from "@/hooks/collect/form-submission/types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useProject } from "@/contexts/ProjectContext";
import { supabase } from "@/integrations/supabase/client";
import { isFormDesigned } from "@/services/formDesignService";
import DemoLimitAlert from "./DemoLimitAlert";
import { useFormPerformanceDebug } from "@/hooks/collect/useFormPerformanceDebug";
import { handleError } from "@/utils/errorHandling";
import { setLastLoadedProjectId } from "@/services/cache/projectCache";

interface AuthenticatedFormContainerProps {
  projectId?: string;
}

const AuthenticatedFormContainer: React.FC<AuthenticatedFormContainerProps> = ({
  projectId,
}) => {
  const formData = useFormDataLoader(projectId, false);
  const storyQuestionData = projectId
    ? useStoryQuestion(projectId)
    : { savedQuestion: null };
  const { savedQuestion } = storyQuestionData;
  const { handleFormSubmit, isSubmitting, demoLimitReached } =
    useFormSubmissionHandler(false, projectId);
  const { isDemo, isSuperAdmin } = useUserRole();
  const [storyCount, setStoryCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { activeProject } = useProject();
  const formIsDesigned = projectId ? isFormDesigned(projectId) : false;

  useFormPerformanceDebug(isSuperAdmin(), projectId);

  useEffect(() => {
    if (isDemo && activeProject?.id) {
      setLoading(true);
      
      Promise.resolve(
        supabase
          .from("stories")
          .select("*", { count: "exact", head: true })
          .eq("st_project_id", activeProject.id)
      ).then(({ count, error }) => {
        if (!error) setStoryCount(count || 0);
      }).catch(err => {
        handleError(err, "Error fetching story count");
      }).finally(() => {
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, activeProject?.id]);

  const handleForceRefresh = () => {
    if (formData.reloadFromRemote) formData.reloadFromRemote();
  };

  if (formData.isLoading) return <FormLoadingState />;
  if (!projectId) return <EmptyFormState />;

  const finalStoryQuestion =
    savedQuestion ||
    (formData.storyQuestion && formData.storyQuestion.trim().length > 0
      ? formData.storyQuestion
      : "");

  const handleSubmit = async (data: StoryData): Promise<boolean> => {
    const enhancedData = {
      ...data,
      projectId: projectId || activeProject?.id,
    };
    const result = await handleFormSubmit(enhancedData);

    if (projectId) {
      setLastLoadedProjectId(projectId);
    }
    
    return result === true || (typeof result === "string" && result !== "demo-limit-reached");
  };

  const remainingStories = storyCount !== null ? Math.max(0, 15 - storyCount) : null;
  const showDemoWarning = isDemo && remainingStories !== null;
  const showDemoError = isDemo && remainingStories !== null && remainingStories <= 0;

  return (
    <div>
      {projectId && isSuperAdmin() && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceRefresh}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reload Form Data
          </Button>
        </div>
      )}

      <DemoLimitAlert
        remainingStories={remainingStories}
        showDemoWarning={showDemoWarning}
        showDemoError={showDemoError}
        demoLimitReached={demoLimitReached}
      />

      {demoLimitReached ? (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <h3 className="text-xl font-semibold mb-2">Demo Account Limit Reached</h3>
          <p>You've reached the maximum of 15 stories for this project.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Demo accounts are limited to 15 stories per project.
            Contact support to upgrade your account for unlimited access.
          </p>
        </div>
      ) : (
        <FormProvider
          initialValues={{
            storyQuestion: finalStoryQuestion,
            sliderQuestions: formData.sliderQuestions || [],
            participantQuestions: formData.participantQuestions || [],
          }}
          onSubmit={handleSubmit}
        >
          <StoryForm isPublic={false} />
        </FormProvider>
      )}
    </div>
  );
};

export default AuthenticatedFormContainer;
