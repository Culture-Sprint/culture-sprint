
import React from "react";
import StoryQuestionGenerator from "./StoryQuestionGenerator";

interface StoryQuestionInitialStateProps {
  loading: boolean;
  error: string | null;
  onGenerate: (e: React.MouseEvent) => void;
}

const StoryQuestionInitialState: React.FC<StoryQuestionInitialStateProps> = ({
  loading,
  error,
  onGenerate
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Create a story question based on your project goals. This question will be shown to participants 
        when they submit stories.
      </p>
      <StoryQuestionGenerator 
        loading={loading}
        error={error}
        onGenerate={onGenerate}
      />
    </div>
  );
};

export default StoryQuestionInitialState;
