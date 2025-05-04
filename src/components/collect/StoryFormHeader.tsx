import React from "react";
import { BookOpen } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
interface StoryFormHeaderProps {
  isPublic?: boolean;
}
const StoryFormHeader: React.FC<StoryFormHeaderProps> = ({
  isPublic = false
}) => {
  console.log("StoryFormHeader - isPublic prop value:", isPublic);
  return <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        {isPublic ? "Share Your Experience" : "Story Collection Form"}
      </CardTitle>
      <CardDescription>Only the story and the title are required (*)</CardDescription>
    </CardHeader>;
};
export default StoryFormHeader;