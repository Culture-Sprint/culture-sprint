import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Trash2 } from "lucide-react";
interface ChatInputProps {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  messagesExist: boolean;
}
const ChatInput: React.FC<ChatInputProps> = ({
  isLoading,
  onSendMessage,
  onClearChat,
  messagesExist
}) => {
  const [prompt, setPrompt] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSendMessage(prompt);
      setPrompt("");
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        onSendMessage(prompt);
        setPrompt("");
      }
    }
  };
  return <form onSubmit={handleSubmit} className="w-full flex gap-2">
      <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask AI..." className="min-h-10 resize-none flex-1" disabled={isLoading} />
      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={isLoading || !prompt.trim()} size="sm" className="text-slate-50 bg-brand-tertiary">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onClearChat} disabled={!messagesExist}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </form>;
};
export default ChatInput;