
import StoryCard from "./StoryCard";

interface Story {
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
  additional_comments?: string;
  isSaved?: boolean;
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
}

interface StoryListProps {
  stories: Story[];
  view: "grid" | "list";
  getFeelingColor: (feeling: string) => string;
  formatDate: (dateString: string) => string;
  onStoryDelete: () => void;
  onToggleSave?: (storyId: number | string, isSaved: boolean) => void;
}

const StoryList = ({ stories, view, getFeelingColor, formatDate, onStoryDelete, onToggleSave }: StoryListProps) => {
  return (
    <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
      {stories.map((story) => (
        <StoryCard 
          key={story.id}
          story={story}
          view={view}
          getFeelingColor={getFeelingColor}
          formatDate={formatDate}
          onDeleteSuccess={onStoryDelete}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
};

export default StoryList;
