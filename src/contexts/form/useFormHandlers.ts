import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FormHandlersProps, StoryData } from "./types";
import { useStoryAudioStatus } from "./hooks/useStoryAudioStatus";
import { buildSliderResponses } from "./utils/buildSliderResponses";
import { buildParticipantResponses } from "./utils/buildParticipantResponses";
import { useParticipantAnswers } from "./hooks/useParticipantAnswers";

export const useFormHandlers = ({
  storyText,
  storyTitle,
  feeling,
  otherFeeling,
  additionalComments,
  touchedSliders,
  sliderValues,
  sliderQuestions,
  participantQuestions,
  participantAnswers,
  setParticipantAnswers,
  isSubmitting,
  setIsSubmitting,
  onSubmit
}: FormHandlersProps) => {
  const { toast } = useToast();
  const { hasAudioRecording, audioUrlRef } = useStoryAudioStatus();
  const {
    participantValues,
    updateParticipantValue,
    handleParticipantAnswerChange
  } = useParticipantAnswers(setParticipantAnswers);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Get audio element and check for recording
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    const hasRecording = (audioElement && audioElement.src && audioElement.src.trim() !== '') || hasAudioRecording;

    if (!storyText.trim() && !hasRecording) {
      toast({
        title: "Missing story",
        description: "Please share your story by writing or recording it.",
        variant: "destructive"
      });
      return;
    }

    if (!storyTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please add a title to your story.",
        variant: "destructive"
      });
      return;
    }

    if (!feeling) {
      toast({
        title: "Missing emotion",
        description: "Please select how you felt about this experience.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const sliderResponses = buildSliderResponses(sliderQuestions, sliderValues, touchedSliders);

      let finalStoryText = storyText;
      let audioData = null;

      if (hasRecording) {
        const audio = audioElement || new Audio(audioUrlRef.current || '');

        if (!storyText.trim()) {
          finalStoryText = "[Audio Recording - Transcription Pending]";
        }

        try {
          if (audio.src) {
            const recordingBlob = await fetch(audio.src).then(r => r.blob());
            if (recordingBlob) {
              const reader = new FileReader();
              const audioPromise = new Promise<string>((resolve, reject) => {
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    const base64Data = reader.result.split(',')[1];
                    resolve(base64Data);
                  } else {
                    reject(new Error('Failed to convert audio to base64'));
                  }
                };
                reader.onerror = reject;
              });

              reader.readAsDataURL(recordingBlob);
              audioData = await audioPromise;
            }
          }
        } catch (err) {
          console.error('Error preparing audio data:', err);
        }
      }

      const storyData: StoryData = {
        title: storyTitle,
        text: finalStoryText,
        emotionalResponse: feeling === 'other' ? otherFeeling : feeling,
        additionalComments: additionalComments || "",
        sliderResponses,
        participantResponses: buildParticipantResponses(participantQuestions, participantAnswers),
        hasAudio: hasRecording
      };

      if (audioData) {
        storyData.audioData = audioData;
      }

      const success = await onSubmit(storyData);

      if (success === true) {
        toast({
          title: "Story submitted",
          description: "Thank you for sharing your story!",
        });
      } else {
        toast({
          title: "Submission failed",
          description: "There was an issue submitting your story. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error submitting form",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    storyText,
    storyTitle,
    feeling,
    otherFeeling,
    additionalComments,
    touchedSliders,
    sliderValues,
    sliderQuestions,
    participantQuestions,
    participantAnswers,
    setIsSubmitting,
    onSubmit,
    toast,
    hasAudioRecording,
    audioUrlRef
  ]);

  return {
    handleSubmit,
    updateParticipantValue,
    handleParticipantAnswerChange,
    participantValues,
  };
};
