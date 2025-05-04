
import React from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LoadingIndicator from "./LoadingIndicator";
import { useNavigate } from "react-router-dom";

interface DefinePhaseFormProps {
  stepId: string;
  onStepChange?: (stepId: string) => void;
}

const DefinePhaseForm: React.FC<DefinePhaseFormProps> = ({ stepId, onStepChange }) => {
  const { activeProject } = useProject();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Redirect to the main design page with the define phase selected
    // This component is no longer needed, but keeping for backward compatibility
    navigate('/design?phase=define');
    
    toast({
      title: "Updated UI",
      description: "The Define phase now uses the same interface as other phases.",
    });
  }, [navigate]);
  
  return <LoadingIndicator message="Redirecting to define phase..." />;
};

export default DefinePhaseForm;
