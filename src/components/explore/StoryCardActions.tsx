
import { Button } from "@/components/ui/button";
import { Info, Download, Bookmark, BookmarkCheck, Trash2, AudioWaveform } from "lucide-react";

interface StoryCardActionsProps {
  onDialogOpen: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onDeleteClick: () => void;
  isTranscribed: boolean;
  audioUrl?: string;
  onTranscribe?: () => void;
  isTranscriptionPending?: boolean;
  isTranscribing?: boolean;
}

const StoryCardActions = ({
  onDialogOpen,
  isSaved,
  onToggleSave,
  onDeleteClick,
  isTranscribed,
  audioUrl,
  onTranscribe,
  isTranscriptionPending,
  isTranscribing
}: StoryCardActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      {isTranscriptionPending && onTranscribe && (
        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700 transition mb-2"
          disabled={isTranscribing}
          onClick={onTranscribe}
          size="sm"
        >
          <AudioWaveform className="h-4 w-4 mr-1" />
          {isTranscribing ? "Transcribing..." : "Transcribe Audio"}
        </Button>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onDialogOpen}>
            <Info className="h-4 w-4 mr-1" />
            View Details
          </Button>

          {isTranscribed && audioUrl && (
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => window.open(audioUrl, "_blank")}
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Audio</span>
            </Button>
          )}
        </div>

        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={onToggleSave}>
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-green-600" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={onDeleteClick}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryCardActions;
