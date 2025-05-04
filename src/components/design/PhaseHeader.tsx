
import React from "react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface PhaseHeaderProps {
  title: string;
  description: string;
  tooltipKey?: string;
}

const PhaseHeader: React.FC<PhaseHeaderProps> = ({ title, description, tooltipKey }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-culturesprint-100 mb-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-culturesprint-600 rounded-full"></div>
        <h2 className="text-lg font-medium text-culturesprint-800">{title} Phase</h2>
        {tooltipKey && (
          <InfoTooltip 
            contentKey={tooltipKey}
            position="top"
            size={16}
          />
        )}
      </div>
      <p className="text-gray-600 text-xs mt-0.5 ml-3">{description}</p>
    </div>
  );
};

export default PhaseHeader;
