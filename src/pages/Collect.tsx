
import ErrorBoundaryLayout from "@/components/layout/ErrorBoundaryLayout";
import CollectContainer from "@/components/collect/CollectContainer";
import { useEffect } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { supabase } from "@/integrations/supabase/client";
import { isAuthenticated } from "@/services/supabaseSync/core/authUtils";
import { clearLastLoadedProjectId } from "@/services/cache/projectCache";

const Collect = () => {
  // Log current route to help with debugging path issues
  console.log("Rendering Collect page, route:", window.location.pathname);
  
  const { activeProject } = useProject();
  
  // Clear the last loaded project ID on component mount
  useEffect(() => {
    // This ensures we don't use cached data from a previous project
    clearLastLoadedProjectId();
  }, []);
  
  // Add debugging to check for form appearance data AND authentication status
  useEffect(() => {
    const checkFormAppearance = async () => {
      if (activeProject?.id) {
        // Check authentication status first
        const isAuthenticatedUser = await isAuthenticated();
        console.log("Authentication status:", isAuthenticatedUser ? "Authenticated" : "NOT authenticated");
        
        // Also directly check for user data to verify auth state
        const { data: userData, error: userError } = await supabase.auth.getUser();
        console.log("User data available:", !!userData.user, "User ID:", userData.user?.id);
        if (userError) {
          console.error("Error checking user data:", userError);
        }
        
        console.log("DEBUG: Checking form appearance data for project:", activeProject.id);
        
        try {
          // First check the exact path where data should be with auth debug
          const { data: exactData, error: exactError } = await supabase
            .from('activity_responses')
            .select('*')
            .eq('ar_project_id', activeProject.id)
            .eq('ar_phase_id', 'build')
            .eq('ar_step_id', 'form-appearance')
            .eq('ar_activity_id', 'form-appearance-editor')
            .maybeSingle();
            
          if (exactError) {
            console.error("Error checking exact form appearance path:", exactError);
            // Check if this is a permissions error
            if (exactError.message.includes("permission denied") || exactError.code === "42501") {
              console.error("THIS IS A PERMISSIONS ERROR! RLS policies might be blocking access");
            }
          } else if (exactData) {
            console.log("DEBUG: Found form appearance data in exact path:", exactData);
            console.log("DEBUG: Form appearance content:", exactData.ar_response);
          } else {
            console.log("DEBUG: No form appearance data found in exact path build/form-appearance/form-appearance-editor");
            
            // Try a service role query (only for debugging)
            try {
              // Try select without any RLS to see if the row exists at all
              const { data: serviceData, error: serviceError } = await supabase.rpc('fetch_activity_response', {
                project_id: activeProject.id,
                phase_id: 'build',
                step_id: 'form-appearance',
                activity_id: 'form-appearance-editor'
              });
              
              if (serviceError) {
                console.error("Error checking with RPC function:", serviceError);
              } else if (serviceData) {
                console.log("Found data using RPC function:", serviceData);
              } else {
                console.log("No data found with RPC function either");
              }
            } catch (rpcError) {
              console.error("Error in RPC function call:", rpcError);
            }
          }
          
          // Then check general form appearance data in any path
          const { data, error } = await supabase
            .from('activity_responses')
            .select('ar_phase_id, ar_step_id, ar_activity_id, ar_response, updated_at')
            .eq('ar_project_id', activeProject.id)
            .eq('ar_activity_id', 'form-appearance-editor')
            .order('updated_at', { ascending: false });
            
          if (error) {
            console.error("Error checking form appearance:", error);
            // Check if this is a permissions error
            if (error.message.includes("permission denied") || error.code === "42501") {
              console.error("THIS IS A PERMISSIONS ERROR on general query! RLS policies might be blocking access");
            }
          } else if (data && data.length > 0) {
            console.log("DEBUG: Found form appearance data in paths:", data);
            
            // Inspect first result in more detail
            if (data[0]) {
              console.log(`DEBUG: Latest form appearance data (${data[0].ar_phase_id}/${data[0].ar_step_id}/${data[0].ar_activity_id}):`, 
                data[0].ar_response);
            }
          } else {
            console.log("DEBUG: No form appearance data found for this project in any path");
            
            // List all activity responses for this project to help debug
            const { data: allData, error: allError } = await supabase
              .from('activity_responses')
              .select('ar_phase_id, ar_step_id, ar_activity_id, updated_at')
              .eq('ar_project_id', activeProject.id)
              .order('updated_at', { ascending: false })
              .limit(20);
              
            if (allError) {
              console.error("Error checking all activity responses:", allError);
              if (allError.message.includes("permission denied") || allError.code === "42501") {
                console.error("THIS IS A PERMISSIONS ERROR on all-data query! RLS policies might be blocking access");
              }
            } else if (allData?.length > 0) {
              console.log("DEBUG: All recent activity responses for this project:", allData);
            } else {
              console.log("DEBUG: No activity responses found for this project");
              
              // Check if the activity_responses table exists and is accessible at all
              const { data: tableData, error: tableError } = await supabase
                .from('activity_responses')
                .select('id')
                .limit(1);
                
              if (tableError) {
                console.error("Error accessing activity_responses table:", tableError);
                if (tableError.message.includes("permission denied") || tableError.code === "42501") {
                  console.error("CRITICAL: Cannot access activity_responses table at all!");
                }
              } else {
                console.log("Can access activity_responses table, found rows:", tableData?.length || 0);
              }
            }
          }
        } catch (err) {
          console.error("Error in form appearance debug check:", err);
        }
      }
    };
    
    checkFormAppearance();
  }, [activeProject?.id]);
  
  return (
    <ErrorBoundaryLayout>
      <div className="p-8">
        <CollectContainer />
      </div>
    </ErrorBoundaryLayout>
  );
};

export default Collect;
