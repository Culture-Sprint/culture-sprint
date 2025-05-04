
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/story/formattingUtils";
import { Headphones, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryDialogProps {
  story: {
    id: number | string;
    title: string;
    text: string;
    feeling: string;
    date: string;
    additional_comments?: string;
    sliderResponses?: Array<{
      id: string;
      question_id: number | string;
      question_text: string;
      value: number | null;
      left_label?: string;
      right_label?: string;
    }>;
    participantResponses?: Array<{
      id: string;
      question_id: string;
      question_text: string;
      response: string;
    }>;
    has_audio?: boolean;
    audio_url?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const StoryDialog: React.FC<StoryDialogProps> = ({ story, isOpen, onClose }) => {
  const hasSliderResponses = story.sliderResponses && story.sliderResponses.length > 0;
  const hasParticipantResponses = story.participantResponses && story.participantResponses.length > 0;
  const hasAdditionalComments = story.additional_comments && story.additional_comments.trim() !== '';
  const isTranscribedStory = story.has_audio && story.audio_url;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {story.title}
            {isTranscribedStory && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ml-2 flex items-center gap-1">
                <Headphones className="h-3 w-3" />
                <span>Audio Recording</span>
              </Badge>
            )}
          </DialogTitle>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <div>
              {formatDate(story.date)} • Feeling: <span className="font-medium">{story.feeling}</span>
            </div>
          </div>
        </DialogHeader>

        {/* Audio player for transcribed stories */}
        {isTranscribedStory && story.audio_url && (
          <div className="mb-4 bg-blue-50 p-3 rounded-md">
            <div className="text-sm font-medium text-blue-700 mb-2">
              This story was recorded as audio and transcribed
            </div>
            <audio controls className="w-full">
              <source src={story.audio_url} type="audio/webm" />
              Your browser does not support the audio element.
            </audio>
            <div className="mt-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => window.open(story.audio_url, '_blank')}
              >
                <Download className="h-4 w-4 mr-1" />
                Download Audio
              </Button>
            </div>
          </div>
        )}

        <div className="whitespace-pre-line">{story.text}</div>

        {hasAdditionalComments && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Additional Comments</h3>
              <div className="whitespace-pre-line">{story.additional_comments}</div>
            </div>
          </>
        )}

        {hasSliderResponses && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Slider Responses</h3>
              <div className="space-y-4">
                {story.sliderResponses?.map((response) => (
                  <div key={response.id} className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium">{response.question_text}</h4>
                    <div className="mt-2 flex items-center space-x-2">
                      {response.value !== null ? (
                        <>
                          <div className="text-gray-500 text-sm">
                            {response.left_label || "Low"}
                          </div>
                          <div className="relative flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-blue-500"
                              style={{ width: `${response.value}%` }}
                            ></div>
                          </div>
                          <div className="text-gray-500 text-sm">
                            {response.right_label || "High"}
                          </div>
                          <div className="ml-2 font-medium">{response.value}%</div>
                        </>
                      ) : (
                        <div className="text-gray-500">No response</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {hasParticipantResponses && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Participant Responses</h3>
              <div className="space-y-4">
                {story.participantResponses?.map((response) => (
                  <div key={response.id} className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium">{response.question_text}</h4>
                    <div className="mt-1">{response.response}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoryDialog;
