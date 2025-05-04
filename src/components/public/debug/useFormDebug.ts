
import { useState, useEffect } from "react";
import { FormAppearance } from "@/components/design/form-appearance/types";
import { supabase } from "@/integrations/supabase/client";
import { checkTablePermissions, checkPublicFormAccess } from "@/services/supabaseSync/operations/core/rlsUtils";

interface UseFormDebugParams {
  projectId: string | null;
}

interface UseFormDebugReturn {
  permissionsReport: any;
  publicAccessStatus: boolean | null;
  directDbData: any;
  isChecking: boolean;
  checkDatabaseDirectly: () => Promise<void>;
}

export const useFormDebug = ({ projectId }: UseFormDebugParams): UseFormDebugReturn => {
  const [directDbData, setDirectDbData] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [permissionsReport, setPermissionsReport] = useState<any>(null);
  const [publicAccessStatus, setPublicAccessStatus] = useState<boolean | null>(null);
  
  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      if (projectId) {
        const report = await checkTablePermissions('activity_responses');
        setPermissionsReport(report);
        console.log("Activity responses permissions report:", report);
        
        // Also check public form access
        const hasPublicAccess = await checkPublicFormAccess(projectId);
        setPublicAccessStatus(hasPublicAccess);
        console.log("Public form access status:", hasPublicAccess);
      }
    };
    
    checkPermissions();
  }, [projectId]);
  
  const checkDatabaseDirectly = async () => {
    if (!projectId) return;
    
    setIsChecking(true);
    try {
      // Check multiple paths to find the data
      const paths = [
        { phase: 'build', step: 'form-appearance' },
        { phase: 'design', step: 'form-appearance' },
        { phase: 'form-appearance', step: 'form-appearance' },
        { phase: 'collect', step: 'form-appearance' }
      ];
      
      const results = [];
      
      for (const path of paths) {
        console.log(`Directly checking database for ${path.phase}/${path.step}/form-appearance-editor`);
        const { data, error } = await supabase
          .from('activity_responses')
          .select('ar_response, ar_phase_id, ar_step_id, id, created_at, updated_at')
          .eq('ar_project_id', projectId)
          .eq('ar_phase_id', path.phase)
          .eq('ar_step_id', path.step)
          .eq('ar_activity_id', 'form-appearance-editor');
          
        if (error) {
          console.error(`Error checking ${path.phase}/${path.step}:`, error);
        } else if (data && data.length > 0) {
          console.log(`Found ${data.length} entries in path ${path.phase}/${path.step}:`, data);
          results.push(...data);
        } else {
          console.log(`No entries found in path ${path.phase}/${path.step}`);
        }
      }
      
      // Also try a more general query to find any appearance-related data
      const { data: generalData, error: generalError } = await supabase
        .from('activity_responses')
        .select('ar_response, ar_phase_id, ar_step_id, ar_activity_id, id, created_at, updated_at')
        .eq('ar_project_id', projectId)
        .ilike('ar_activity_id', '%appearance%')
        .order('updated_at', { ascending: false });
        
      if (!generalError && generalData && generalData.length > 0) {
        console.log("Found general appearance data:", generalData);
        const newEntries = generalData.filter(gd => 
          !results.some(r => r.id === gd.id)
        );
        
        if (newEntries.length > 0) {
          console.log(`Found ${newEntries.length} additional entries:`, newEntries);
          results.push(...newEntries);
        }
      }
      
      // Special search for latest activity response (generic search)
      const { data: latestData, error: latestError } = await supabase
        .from('activity_responses')
        .select('ar_response, ar_phase_id, ar_step_id, ar_activity_id, id, created_at, updated_at')
        .eq('ar_project_id', projectId)
        .order('updated_at', { ascending: false })
        .limit(20);
      
      if (!latestError && latestData && latestData.length > 0) {
        console.log("Most recent activity entries:", latestData);
        
        // Look for any entries that might contain form appearance data
        const appearanceEntries = latestData.filter(entry => {
          if (typeof entry.ar_response === 'object' && entry.ar_response !== null) {
            // Check if response has typical appearance properties
            return (
              'backgroundColor' in entry.ar_response || 
              'logoUrl' in entry.ar_response || 
              'headerText' in entry.ar_response
            );
          }
          return false;
        });
        
        if (appearanceEntries.length > 0) {
          console.log("Found potential appearance data in recent entries:", appearanceEntries);
          const newEntries = appearanceEntries.filter(ae => 
            !results.some(r => r.id === ae.id)
          );
          
          if (newEntries.length > 0) {
            console.log(`Found ${newEntries.length} additional appearance entries:`, newEntries);
            results.push(...newEntries);
          }
        }
      }
      
      setDirectDbData(results.length > 0 ? results : null);
    } catch (err) {
      console.error("Error querying database:", err);
    } finally {
      setIsChecking(false);
    }
  };
  
  return {
    permissionsReport,
    publicAccessStatus,
    directDbData,
    isChecking,
    checkDatabaseDirectly
  };
};
