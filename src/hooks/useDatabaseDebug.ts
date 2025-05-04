
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Custom hook to provide database debugging functionality
 */
export const useDatabaseDebug = () => {
  const [loading, setLoading] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);

  // Run a test query with proper error handling
  const testQuery = async (projectId?: string) => {
    setLoading(true);
    try {
      if (!projectId) {
        toast({
          title: "No project selected",
          description: "Please select a project to test the database connection",
          variant: "destructive"
        });
        return;
      }

      // Basic connectivity test - using renamed column
      const basicTest = await supabase
        .from('activity_responses')
        .select('count(*)', { count: 'exact', head: true })
        .eq('ar_project_id', projectId);
      
      // Test using our RPC function
      const rpcTest = await supabase.rpc('fetch_activity_response', {
        project_id: projectId,
        phase_id: 'test',
        step_id: 'test',
        activity_id: 'test'
      });
        
      // Test with a direct query - using renamed column
      const directTest = await supabase
        .from('activity_responses')
        .select('*')
        .eq('ar_project_id', projectId)
        .limit(1);
      
      // Properly type the result
      const rpcResult = rpcTest.data as { found: boolean; data?: any; error?: any } | null;
      
      setDebugResult({
        timestamp: new Date().toISOString(),
        basicTest: {
          success: !basicTest.error,
          error: basicTest.error,
          count: basicTest.count
        },
        rpcTest: {
          success: !rpcTest.error,
          error: rpcTest.error,
          data: rpcResult,
          found: rpcResult?.found || false
        },
        directTest: {
          success: !directTest.error,
          error: directTest.error,
          data: directTest.data
        },
        recommendations: generateRecommendations(basicTest.error, rpcTest.error, directTest.error)
      });
      
      console.log("Database debug results:", debugResult);
      
      // Show success or failure message
      if (directTest.error) {
        toast({
          title: "Database query failed",
          description: directTest.error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Database query successful",
          description: "The direct query worked correctly",
        });
      }
      
    } catch (error: any) {
      console.error("Debug query error:", error);
      setDebugResult({ error });
      toast({
        title: "Error testing database",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Generate recommendations based on errors
  const generateRecommendations = (basicError: any, rpcError: any, directError: any) => {
    const recommendations = [];
    
    if (basicError) {
      recommendations.push("Database connection issue - check authentication and permissions");
    }
    
    if (rpcError && !directError) {
      recommendations.push("RPC function error - ensure database functions are properly deployed");
    }
    
    if (directError && directError.message?.includes("ambiguous")) {
      recommendations.push("Column ambiguity detected - use fully qualified column names in queries");
    }
    
    if (directError && !rpcError) {
      recommendations.push("Direct query error but RPC works - consider using RPC functions for all operations");
    }
    
    return recommendations;
  };

  return {
    loading,
    debugResult,
    testQuery
  };
};
