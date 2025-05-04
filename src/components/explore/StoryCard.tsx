
import React, { useState, memo } from "react";
import { Card } from "@/components/ui/card";
import StoryDialog from "./StoryDialog";
import DeleteStoryDialog from "./DeleteStoryDialog";
import { formatMonthDay } from "@/utils/story/formattingUtils";
import StoryCardContent from "./StoryCardContent";
import { useProject } from "@/contexts/ProjectContext";
import { useUserRole } from "@/hooks/useUserRole";

interface StoryCardProps {
  story: {
    id: number | string;
    title: string;
    text: string;
    name?: string;
    email?: string;
    feeling: string;
    feelingSentiment?: "positive" | "neutral" | "negative";
    impact?: number;
    date: string;
    isPublic?: boolean;
    isImported?: boolean;
    additional_comments?: string;
    isSaved?: boolean;
    has_audio?: boolean;
    audio_url?: string;
    sliderResponses?: Array<{
      id: string;
      question_id: number;
      question_text: string;
      value: number | null;
      response_type?: "answered" | "skipped";
      left_label?: string;
      right_label?: string;
    }>;
    participantResponses?: Array<{
      id: string;
      question_id: string;
      question_text: string;
      response: string;
    }>;
  };
  view: "grid" | "list";
  getFeelingColor: (feeling: string) => string;
  formatDate: (dateString: string) => string;
  onDeleteSuccess?: () => void;
  onToggleSave?: (storyId: number | string, isSaved: boolean) => void;
}

const StoryCard = memo<StoryCardProps>(({ 
  story, 
  view, 
  getFeelingColor, 
  formatDate, 
  onDeleteSuccess, 
  onToggleSave 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(story.isSaved || false);
  const { activeProject } = useProject();
  const { isSuperAdmin } = useUserRole();
  
  const isTemplateProject = activeProject?.is_template || activeProject?._clone;
  
  const handleSaveToggle = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    const savedStories = JSON.parse(localStorage.getItem('savedStories') || '{}');
    if (newSavedState) {
      savedStories[story.id] = true;
    } else {
      delete savedStories[story.id];
    }
    localStorage.setItem('savedStories', JSON.stringify(savedStories));
    
    if (onToggleSave) {
      onToggleSave(story.id, newSavedState);
    }
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    
    if (onDeleteSuccess) {
      onDeleteSuccess();
    }
  };

  const handleDeleteClick = () => {
    if (!(isTemplateProject && !isSuperAdmin())) {
      setIsDeleteDialogOpen(true);
    }
  };

  const isTranscribedStory = Boolean(story.has_audio);

  return (
    <>
      <Card key={story.id} className={`overflow-hidden ${view === "list" ? "flex flex-col md:flex-row" : ""}`}>
        <div className={view === "list" ? "md:w-2/3" : ""}>
          <StoryCardContent
            title={story.title}
            text={story.text}
            feeling={story.feeling}
            feelingSentiment={story.feelingSentiment}
            date={story.date}
            name={story.name}
            isPublic={story.isPublic}
            isImported={story.isImported}
            isSaved={isSaved}
            isTranscribed={isTranscribedStory}
            audioUrl={story.audio_url}
            storyId={story.id}
            view={view}
            formatDate={formatMonthDay}
            getFeelingColor={getFeelingColor}
            onDialogOpen={() => setIsDialogOpen(true)}
            onToggleSave={handleSaveToggle}
            onDeleteClick={handleDeleteClick}
          />
        </div>
      </Card>

      <StoryDialog 
        story={story}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <DeleteStoryDialog
        storyId={story.id}
        storyTitle={story.title}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
});

StoryCard.displayName = "StoryCard";

export default StoryCard;
