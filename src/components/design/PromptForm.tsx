
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ 
  prompt, 
  setPrompt, 
  loading, 
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Textarea
        placeholder="Ask the design assistant for help with your project..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="w-full bg-white border-gray-200"
        disabled={loading}
      />
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading || !prompt.trim()}
          className="flex items-center gap-2 bg-[#7A0266] hover:bg-[#63014F] text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze Design
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PromptForm;
