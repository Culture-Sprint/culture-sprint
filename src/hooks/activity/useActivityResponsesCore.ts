
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

/**
 * Core hook for activity responses with shared state and utility functions
 */
export const useActivityResponsesCore = (projectId: string) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  /**
   * Show an error toast message
   */
  const showErrorToast = useCallback((title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  }, [toast]);

  /**
   * Show a success toast message
   */
  const showSuccessToast = useCallback((title: string, description: string) => {
    toast({
      title,
      description,
    });
  }, [toast]);

  /**
   * Log a debug message with project ID context
   */
  const logDebug = useCallback((message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[ActivityResponses] ${message}`);
    }
  }, []);

  /**
   * Debug Supabase queries with project ID context
   */
  const debugSupabaseQuery = useCallback((message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SupabaseDebug] [${projectId}] ${message}`);
    }
  }, [projectId]);

  return {
    loading,
    setLoading,
    saving,
    setSaving,
    showErrorToast,
    showSuccessToast,
    logDebug,
    debugSupabaseQuery
  };
};
