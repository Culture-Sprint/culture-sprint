
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ContextSection } from "../contextProcessingUtils";

interface ContextTabContentProps {
  context: string;
  contextStats: {
    totalLength: number;
    sectionCount: number;
    projectName: string;
  };
  contextSections: ContextSection[];
}

const ContextTabContent: React.FC<ContextTabContentProps> = ({ 
  context, 
  contextStats, 
  contextSections 
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: description,
          duration: 2000,
        });
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      });
  };

  // Filter sections to remove any potential duplicates
  const uniqueSections = contextSections.reduce((acc: ContextSection[], section: ContextSection) => {
    // Check if this section title already exists
    const existingIndex = acc.findIndex(s => s.title === section.title);
    
    if (existingIndex === -1) {
      // Section doesn't exist yet, add it
      acc.push(section);
    } else {
      // Section exists, check if it has different content
      // Only add non-duplicate content lines
      const existingContent = new Set(acc[existingIndex].content);
      section.content.forEach(line => {
        if (!existingContent.has(line)) {
          acc[existingIndex].content.push(line);
        }
      });
    }
    
    return acc;
  }, []);

  return (
    <div className="mt-0">
      <div className="bg-amber-50 p-3 mb-4 rounded border border-amber-200 flex justify-between items-center">
        <div>
          <h4 className="font-medium text-amber-800">Context Stats</h4>
          <p className="text-sm text-amber-700">
            Total length: {contextStats.totalLength} characters | 
            Sections: {contextStats.sectionCount} | 
            Project: {contextStats.projectName}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={() => copyToClipboard(context, "Context copied to clipboard")}
        >
          <Copy className="h-4 w-4" />
          <span>Copy All</span>
        </Button>
      </div>
      
      <ScrollArea className="h-[70vh]">
        <div className="space-y-4">
          {uniqueSections.map((section, index) => (
            <div key={index} className="border rounded p-3">
              <div className="font-medium bg-gray-100 p-2 mb-2 flex justify-between items-center">
                <span>{section.title}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2"
                  onClick={() => copyToClipboard(
                    [section.title, ...section.content].join('\n'), 
                    `Section "${section.title}" copied`
                  )}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  <span className="text-xs">Copy</span>
                </Button>
              </div>
              <div className="pl-4 space-y-1">
                {section.content.map((line, lineIndex) => (
                  <p key={lineIndex} className="text-sm whitespace-pre-wrap">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ContextTabContent;
