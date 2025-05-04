
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TabContentProps {
  content: string;
  title?: string;
  description?: string;
  className?: string;
  onCopy?: () => void;
}

export const FullPromptTabContent: React.FC<TabContentProps> = ({ content, onCopy }) => {
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

export const PromptTabContent: React.FC<TabContentProps> = ({ content }) => {
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

export const ResponseTabContent: React.FC<TabContentProps> = ({ content }) => {
  return (
    <div className="mt-0">
      <ScrollArea className="h-[70vh]">
        <div className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap border">
          {content || "No response yet"}
        </div>
      </ScrollArea>
    </div>
  );
};

interface ContextSection {
  title: string;
  content: string[];
}

interface ContextTabContentProps {
  context: string;
  contextStats: {
    totalLength: number;
    sectionCount: number;
    projectName: string;
  };
  contextSections: ContextSection[];
}

export const ContextTabContent: React.FC<ContextTabContentProps> = ({ 
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
          {contextSections.map((section, index) => (
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
