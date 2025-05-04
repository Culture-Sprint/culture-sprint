
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface CollapsedContentProps {
  onExpand: () => void;
}

const CollapsedContent: React.FC<CollapsedContentProps> = ({ onExpand }) => {
  return (
    <div className="text-center py-6">
      <p className="text-gray-600 mb-4">
        Use AI to analyze patterns and gain insights from your story collection
      </p>
      <Button 
        onClick={onExpand}
        variant="default"
        className="bg-[#7A0266] hover:bg-[#63014F] text-white"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Analyze Patterns
      </Button>
    </div>
  );
};

export default CollapsedContent;
