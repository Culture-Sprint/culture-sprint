
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StoryCardBadges from "./StoryCardBadges";
import StoryCardActions from "./StoryCardActions";
import { useState } from "react";
import { useToast } from "@/hooks/toast";
import { retryTranscription } from "@/utils/story/retryTranscription";

interface StoryCardContentProps {
  title: string;
  text: string;
  feeling: string;
  feelingSentiment?: "positive" | "neutral" | "negative";
  date: string;
  name?: string;
  isPublic?: boolean;
  isImported?: boolean;
  isSaved?: boolean;
  isTranscribed?: boolean;
  audioUrl?: string;
  storyId: number | string;
  view: "grid" | "list";
  formatDate: (date: string) => string;
  getFeelingColor: (feeling: string) => string;
  onDialogOpen: () => void;
  onToggleSave: () => void;
  onDeleteClick: () => void;
}

const StoryCardContent = ({
  title,
  text,
  feeling,
  feelingSentiment,
  date,
  name,
  isPublic,
  isImported,
  isSaved,
  isTranscribed,
  audioUrl,
  storyId,
  view,
  formatDate,
  getFeelingColor,
  onDialogOpen,
  onToggleSave,
  onDeleteClick,
}: StoryCardContentProps) => {
  const { toast } = useToast();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const feelingColor = getFeelingColor(feeling);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const isTranscriptionPending =
    isTranscribed && text === "[Audio Recording - Transcription Pending]" && !!audioUrl;

  const handleRetryTranscription = async () => {
    if (!audioUrl || !storyId) {
      toast({
        title: "Missing data",
        description: "Cannot retry transcription: audio or story ID missing.",
        variant: "destructive",
      });
      return;
    }
    setIsTranscribing(true);
    try {
      toast({ title: "Transcribing...", description: "Attempting to transcribe the audio. Please wait." });
      await retryTranscription(audioUrl, storyId);
      toast({
        title: "Transcription requested",
        description: "The transcription was retried. Reload to see the new transcription shortly.",
      });
    } catch (err: any) {
      toast({
        title: "Transcription failed",
        description: String(err?.message || err),
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const displayText = view === "list" ? truncateText(text, 200) : truncateText(text, 120);
  const displayTitle = truncateText(title, 50);

  return (
    <>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg mr-2">{displayTitle}</CardTitle>
          <StoryCardBadges
            feeling={feeling}
            feelingSentiment={feelingSentiment}
            isPublic={isPublic}
            isImported={isImported}
            isTranscribed={!!isTranscribed}
            feelingColor={feelingColor}
          />
        </div>
        <div className="flex justify-between items-center text-sm mt-1 text-gray-500">
          <span>{formatDate(date)}</span>
          {name && <span>{name}</span>}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="text-sm whitespace-pre-line mb-3">{displayText}</p>
        <StoryCardActions
          onDialogOpen={onDialogOpen}
          isSaved={!!isSaved}
          onToggleSave={onToggleSave}
          onDeleteClick={onDeleteClick}
          isTranscribed={!!isTranscribed}
          audioUrl={audioUrl}
          onTranscribe={isTranscriptionPending ? handleRetryTranscription : undefined}
          isTranscriptionPending={isTranscriptionPending}
          isTranscribing={isTranscribing}
        />
      </CardContent>
    </>
  );
};

export default StoryCardContent;
