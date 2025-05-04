
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PromptTabContentProps {
  content: string;
}

const PromptTabContent: React.FC<PromptTabContentProps> = ({ content }) => {
  return (
    <div className="mt-0">
      <ScrollArea className="h-[70vh]">
        <div className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap border">
          {content}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PromptTabContent;
