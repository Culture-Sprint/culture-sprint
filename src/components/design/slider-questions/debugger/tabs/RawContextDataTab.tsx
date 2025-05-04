
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RawContextDataTabProps {
  rawContextData: any;
}

const RawContextDataTab: React.FC<RawContextDataTabProps> = ({ rawContextData }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <div className="mt-0">
      <div className="bg-amber-50 p-3 mb-4 rounded border border-amber-200">
        <h4 className="font-medium text-amber-800">Raw Context Data</h4>
        <p className="text-sm text-amber-700">
          This is the raw data returned by fetchComprehensiveProjectContext before formatting
        </p>
      </div>
      <ScrollArea className="h-[70vh]">
        <div className="space-y-4">
          {rawContextData ? (
            typeof rawContextData === 'object' ? (
              // Display as expandable object
              Object.entries(rawContextData).map(([key, value], index) => (
                <div key={index} className="border rounded-md overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer"
                    onClick={() => toggleSection(key)}
                  >
                    <span className="font-medium">{key}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      {expandedSections[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </div>
                  {expandedSections[key] && (
                    <div className="p-3 bg-white border-t">
                      <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
                        {typeof value === 'object' 
                          ? JSON.stringify(value, null, 2) 
                          : String(value)
                        }
                      </pre>
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Display as text
              <div className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap border">
                {rawContextData}
              </div>
            )
          ) : (
            <div className="py-6 text-center border rounded-md bg-gray-50">
              <p className="text-gray-500">Could not extract raw context data</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RawContextDataTab;
