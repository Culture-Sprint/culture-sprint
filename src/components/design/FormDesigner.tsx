
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useProject } from "@/contexts/ProjectContext";
import { markFormAsDesigned } from "@/services/utils/storageUtils";
import { clearAllFormCaches } from "@/hooks/collect/form-fetch/formDataCache";
import { InfoTooltip } from "@/components/ui/info-tooltip";

// Import refactored components and hooks
import FormComponentsStatus from "./form-designer/FormComponentsStatus";
import DesignFormButton from "./form-designer/DesignFormButton";
import { useFormComponentsCheck } from "./form-designer/useFormComponentsCheck";

const FormDesigner: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeProject } = useProject();
  
  const { 
    checkResults, 
    isCheckingQuestions, 
    checkFormComponents 
  } = useFormComponentsCheck(activeProject?.id);

  const handleDesignForm = async () => {
    if (!activeProject?.id) {
      toast({
        title: "No project selected",
        description: "Please select a project before designing a form.",
        variant: "destructive"
      });
      return;
    }

    const hasStoryQuestion = await checkFormComponents(activeProject.id, true);
    
    if (!hasStoryQuestion) {
      return;
    }

    toast({
      title: "Form design ready",
      description: "Navigating to the story collection form."
    });
    
    markFormAsDesigned(activeProject.id);
    
    clearAllFormCaches(activeProject.id);
    console.log("All form caches cleared for project:", activeProject.id);
    
    setTimeout(() => {
      navigate("/collect");
    }, 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Story Collection Form Design</CardTitle>
          <InfoTooltip contentKey="design-form-builder" size={16} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Design how participants will enter their stories and additional information. 
          This will create a form based on your selected questions and configuration.
        </p>
        
        <FormComponentsStatus checkResults={checkResults} />
        
        <DesignFormButton 
          onClick={handleDesignForm} 
          isDisabled={isCheckingQuestions}
        />
      </CardContent>
    </Card>
  );
};

export default FormDesigner;
