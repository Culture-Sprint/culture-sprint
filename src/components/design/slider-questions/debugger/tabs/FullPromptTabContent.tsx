
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FullPromptTabContentProps {
  content: string;
}

const FullPromptTabContent: React.FC<FullPromptTabContentProps> = ({ content }) => {
  return (
    <div className="mt-0">
      <div className="bg-blue-50 p-3 mb-4 rounded border border-blue-200">
        <h4 className="font-medium text-blue-800">Complete AI Prompt (With Context)</h4>
        <p className="text-sm text-blue-700">
          This is how the entire prompt (including context) appears to the AI model
        </p>
      </div>
      
      <ScrollArea className="h-[70vh]">
        <div className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap border font-mono">
          {content || "No full prompt available"}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FullPromptTabContent;
