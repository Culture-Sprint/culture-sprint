import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
interface ImprovementFormProps {
  improvementPrompt: string;
  onImprovementPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}
const ImprovementForm: React.FC<ImprovementFormProps> = ({
  improvementPrompt,
  onImprovementPromptChange,
  onSubmit,
  loading
}) => {
  return <form onSubmit={onSubmit} className="space-y-4">
      <Textarea placeholder="Example: 'Make this question more engaging' or 'Focus more on emotional aspects'" value={improvementPrompt} onChange={onImprovementPromptChange} rows={2} className="w-full" disabled={loading} />
      
      <Button type="submit" disabled={loading || !improvementPrompt.trim()} className="w-full flex items-center justify-center gap-2 bg-brand-tertiary">
        {loading ? <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Improving question...</span>
          </> : <>
            <Sparkles className="h-4 w-4" />
            <span>Improve Question</span>
          </>}
      </Button>
      
      {loading && <div className="text-xs text-blue-600 text-center bg-blue-50 p-2 rounded-md border border-blue-100">
          Optimizing your question... This should only take a few seconds.
        </div>}
    </form>;
};
export default ImprovementForm;