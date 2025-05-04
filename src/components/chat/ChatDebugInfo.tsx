
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bug, CopyIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";

interface ChatDebugInfoProps {
  prompt: string | null;
  context: string | null;
  response: string | null;
}

const ChatDebugInfo: React.FC<ChatDebugInfoProps> = ({ prompt, context, response }) => {
  const { toast } = useToast();
  const { isSuperAdmin } = useUserRole();
  
  if (!isSuperAdmin()) {
    return null;
  }
  
  if (!prompt && !context && !response) return null;
  
  const copyToClipboard = (text: string, description: string) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: description,
          duration: 2000,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      });
  };

  const fullPrompt = context && prompt ? `${context}\n\nUSER QUERY:\n${prompt}` : prompt || context || "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Debug AI" className="text-orange-600 border-orange-200 hover:bg-orange-50">
          <Bug className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Pattern Discovery Debug Info</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={() => copyToClipboard(fullPrompt, "Full prompt copied to clipboard")}
            >
              <CopyIcon className="h-3 w-3 mr-1" />
              <span className="text-xs">Copy Full Prompt</span>
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="context">
          <TabsList className="mb-4">
            <TabsTrigger value="context">Project Context</TabsTrigger>
            <TabsTrigger value="prompt">User Query</TabsTrigger>
            <TabsTrigger value="fullPrompt">Full Prompt</TabsTrigger>
            <TabsTrigger value="response">AI Response</TabsTrigger>
          </TabsList>
          
          <TabsContent value="context">
            <Badge variant="outline" className="mb-2">Context Length: {context?.length || 0} characters</Badge>
            <ScrollArea className="h-[70vh]">
              <div className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap border">
                {context || "No context available"}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="prompt">
            <Badge variant="outline" className="mb-2">Prompt Length: {prompt?.length || 0} characters</Badge>
            <ScrollArea className="h-[70vh]">
              <div className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap border">
                {prompt || "No prompt available"}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="fullPrompt">
            <Badge variant="outline" className="mb-2">Full Prompt Length: {fullPrompt.length} characters</Badge>
            <ScrollArea className="h-[70vh]">
              <div className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap border font-mono">
                {fullPrompt || "No full prompt available"}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="response">
            <Badge variant="outline" className="mb-2">Response Length: {response?.length || 0} characters</Badge>
            <ScrollArea className="h-[70vh]">
              <div className="bg-gray-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap border">
                {response || "No response available"}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDebugInfo;
