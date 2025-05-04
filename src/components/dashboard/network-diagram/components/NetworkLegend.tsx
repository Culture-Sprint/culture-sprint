
import React from "react";
import { ThemeCluster } from "../types";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface NetworkLegendProps {
  themeClusters: ThemeCluster[];
}

const NetworkLegend: React.FC<NetworkLegendProps> = ({ themeClusters }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 rounded-t-lg backdrop-blur-sm text-sm flex justify-center">
      <div className="flex flex-wrap gap-4 justify-center max-w-[600px]">
        {themeClusters.length > 0 ? (
          themeClusters.map((cluster, index) => (
            <HoverCard key={`legend-${index}`}>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: cluster.color }}
                  ></div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="p-2 text-sm">
                {cluster.theme}
              </HoverCardContent>
            </HoverCard>
          ))
        ) : (
          <div className="text-gray-500">No themes analyzed yet</div>
        )}
      </div>
    </div>
  );
};

export default NetworkLegend;
