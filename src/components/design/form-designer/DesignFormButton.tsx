
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { useFormComponentsCheck } from "./useFormComponentsCheck";

interface DesignFormButtonProps {
  disabled?: boolean;
  className?: string;
  onClick?: () => Promise<void>;
  isDisabled?: boolean;
}

const DesignFormButton: React.FC<DesignFormButtonProps> = ({ 
  disabled = false,
  className = "",
  onClick,
  isDisabled = false
}) => {
  const navigate = useNavigate();
  const { activeProject } = useProject();
  const { isCheckingQuestions, checkFormComponents } = useFormComponentsCheck(activeProject?.id);
  
  const handleClick = async () => {
    if (onClick) {
      await onClick();
    } else {
      // Make sure to pass the project ID to checkFormComponents
      const canProceed = await checkFormComponents(activeProject?.id || '', true);
      
      if (canProceed) {
        navigate('/collect');
      }
    }
  };
  
  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isDisabled || isCheckingQuestions}
      className={className}
    >
      Preview Form
    </Button>
  );
};

export default DesignFormButton;
