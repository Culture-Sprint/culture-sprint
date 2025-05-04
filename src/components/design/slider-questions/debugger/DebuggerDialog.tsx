
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bug, CopyIcon } from "lucide-react";
import { AIDebugInfo } from '@/hooks/slider-questions/sliderQuestionAIGenerator';
import DebuggerTabs from './DebuggerTabs';
import { useToast } from '@/components/ui/use-toast';

interface DebuggerDialogProps {
  debugInfo: AIDebugInfo | null;
}

const DebuggerDialog: React.FC<DebuggerDialogProps> = ({ debugInfo }) => {
  const { toast } = useToast();
  
  if (!debugInfo) return null;
  
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Show debug info">
          <Bug className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>AI Generation Debug Info</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={() => copyToClipboard(debugInfo.context, "Full context copied to clipboard")}
            >
              <CopyIcon className="h-3 w-3 mr-1" />
              <span className="text-xs">Copy Full Context</span>
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <DebuggerTabs debugInfo={debugInfo} />
      </DialogContent>
    </Dialog>
  );
};

export default DebuggerDialog;
