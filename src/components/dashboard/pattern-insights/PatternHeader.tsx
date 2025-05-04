
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const PatternHeader: React.FC = () => {
  return (
    <>
      <div className="flex items-center gap-2">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Search className="h-5 w-5 text-primary opacity-80" />
          Pattern Discovery
        </CardTitle>
        <InfoTooltip contentKey="dashboard-pattern-discovery" size={16} />
      </div>
      <CardDescription>
        Use AI to discover patterns and insights in your story collection
      </CardDescription>
    </>
  );
};

export default PatternHeader;
