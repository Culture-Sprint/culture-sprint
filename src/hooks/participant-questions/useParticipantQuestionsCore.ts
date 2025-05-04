
import { useState } from "react";
import { useToast } from "@/hooks/toast";
import { isAuthenticated } from "@/services/supabaseSync/operations";

/**
 * Core functionality for participant questions that is shared between fetch and save hooks
 */
export const useParticipantQuestionsCore = (projectId: string) => {
  // State for loading and saving indicators
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const { toast } = useToast();

  /**
   * Display an error toast with custom title and description
   */
  const showErrorToast = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  /**
   * Display a success toast with custom title and description
   */
  const showSuccessToast = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  };

  /**
   * Debug logging with project ID context
   */
  const logDebug = (message: string, ...args: any[]) => {
    console.log(`[ParticipantQuestions] ${message}`, ...args);
  };

  return {
    loading,
    setLoading,
    saving,
    setSaving,
    showErrorToast,
    showSuccessToast,
    logDebug,
    isAuthenticated
  };
};
