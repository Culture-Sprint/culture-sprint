
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import ChatGpt from "@/components/chat/ChatGpt";
import { useToast } from "@/components/ui/use-toast";
import type { ChatMessage } from "@/types/chatTypes";
import { useUserRole } from "@/hooks/useUserRole";

interface ExpandedContentProps {
  projectContext: string;
  autoSendQuestion: boolean;
  onQuestionSent: () => void;
  onCollapse: () => void;
  onChatContentChange: (messages: ChatMessage[]) => void;
  chatMessages: ChatMessage[];
}

const ExpandedContent: React.FC<ExpandedContentProps> = ({
  projectContext,
  autoSendQuestion,
  onQuestionSent,
  onCollapse,
  onChatContentChange,
  chatMessages
}) => {
  const { toast } = useToast();
  const { isSuperAdmin } = useUserRole();

  const handleCopyChat = () => {
    if (chatMessages.length === 0) {
      toast({
        title: "Nothing to copy",
        description: "There are no chat messages to copy.",
        variant: "destructive",
      });
      return;
    }

    const chatText = chatMessages.map(msg => {
      const role = msg.role === 'user' ? 'You' : 'AI Assistant';
      return `${role}: ${msg.content}`;
    }).join('\n\n');

    navigator.clipboard.writeText(chatText)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Chat content has been copied to your clipboard.",
          variant: "default",
        });
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard: " + err.message,
          variant: "destructive",
        });
      });
  };

  return (
    <div className="py-2">
      <div className="mb-4 flex justify-between">
        <Button 
          variant="default" 
          size="sm"
          onClick={handleCopyChat}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Chat
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCollapse}
        >
          Hide Analysis
        </Button>
      </div>
      <ChatGpt 
        projectContext={projectContext} 
        title="Pattern Discovery Assistant"
        initialQuestion={autoSendQuestion ? "What patterns can you extract from the data?" : undefined}
        onQuestionSent={onQuestionSent}
        showDebugButton={isSuperAdmin()}
        autoScroll={true}
        onChatContentChange={onChatContentChange}
      />
    </div>
  );
};

export default ExpandedContent;
