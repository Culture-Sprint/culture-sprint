
import React from "react";
import { useForm } from "@/contexts/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StoryTitleProps {
  isPublic?: boolean;
}

const StoryTitle: React.FC<StoryTitleProps> = ({ isPublic = false }) => {
  const { storyTitle, setStoryTitle } = useForm();
  
  return (
    <div>
      <Label 
        htmlFor="storyTitle" 
        className={`flex items-center gap-1 ${isPublic ? 'text-gray-700' : ''}`}
      >
        Add a title or hashtag for your story *
      </Label>
      <Input 
        id="storyTitle" 
        value={storyTitle}
        onChange={(e) => setStoryTitle(e.target.value)}
        placeholder="Give your story a meaningful title or hashtag"
        className={`mt-1 ${isPublic ? 'border-blue-200 focus:border-blue-400' : ''}`}
      />
    </div>
  );
};

export default StoryTitle;
