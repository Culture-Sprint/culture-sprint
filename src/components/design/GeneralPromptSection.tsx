
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Trash2 } from "lucide-react";
import type { ChatMessage } from "@/types/chatTypes";
import ChatMessageComponent from "@/components/chat/ChatMessage";

interface GeneralPromptSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  messages: ChatMessage[];
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClearChat: () => void;
  projectContext?: string;
}

const GeneralPromptSection: React.FC<GeneralPromptSectionProps> = ({
  prompt,
  setPrompt,
  messages,
  loading,
  onSubmit,
  onClearChat,
  projectContext = ''
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Use AI to help design your story collection project. Ask for suggestions on themes, slider questions, or general advice.
      </p>

      <div className="flex flex-col h-full rounded-md border">
        <ScrollArea className="h-80 w-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[200px] items-center justify-center text-gray-500 text-sm">
                Start a conversation with the Design Assistant
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessageComponent key={index} message={message} />
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-3">
          <form onSubmit={onSubmit} className="flex gap-2">
            <Textarea
              placeholder="Ask the design assistant for help with your project..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 min-h-10 resize-none"
              disabled={loading}
            />
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading || !prompt.trim()} size="sm">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={onClearChat} 
                disabled={messages.length === 0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GeneralPromptSection;
