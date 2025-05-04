
import React from "react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface InfoTipProps {
  showTip: boolean;
  allChangesSaved: boolean;
}

const InfoTip: React.FC<InfoTipProps> = ({ showTip, allChangesSaved }) => {
  if (!showTip || allChangesSaved) return null;
  
  return (
    <div className="bg-brand-background p-3 rounded-md border border-brand-accent mt-4 flex items-start gap-2">
      <InfoTooltip 
        contentKey="design-slider-questions"
        content="Use these slider questions to ask participants about how specific factors influenced their story. The 'Generate from Factors' button will create questions based on the influencing factors you identified in Project Details."
        usePopover={true}
        className="mt-0.5"
      />
      <p className="text-sm">
        <strong>Tip:</strong> Use these slider questions to ask participants about how specific factors influenced their story.
        The "Generate from Factors" button will create questions based on the influencing factors you identified in Project Details.
      </p>
    </div>
  );
};

export default InfoTip;
