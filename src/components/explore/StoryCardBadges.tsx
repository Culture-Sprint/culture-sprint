
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Headphones } from "lucide-react";

interface StoryCardBadgesProps {
  feeling: string;
  feelingSentiment?: "positive" | "neutral" | "negative";
  isPublic?: boolean;
  isImported?: boolean;
  isTranscribed?: boolean;
  feelingColor: string;
}

const StoryCardBadges = ({
  feeling,
  feelingSentiment,
  isPublic,
  isImported,
  isTranscribed,
  feelingColor,
}: StoryCardBadgesProps) => (
  <div className="flex flex-shrink-0 gap-1">
    {isTranscribed && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
              <Headphones className="h-3 w-3" />
              <span className="hidden sm:inline">Audio</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This story was recorded as audio and transcribed</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}

    {isImported && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Imported
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This story was imported from another source</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}

    {isPublic && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Public
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This story was submitted through a public form</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}

    <Badge
      variant="outline"
      className={
        feelingSentiment === "positive"
          ? "bg-green-50 text-green-700 border-green-200"
          : feelingSentiment === "neutral"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : feelingSentiment === "negative"
          ? "bg-red-50 text-red-700 border-red-200"
          : feelingColor
      }
    >
      {feeling}
    </Badge>
  </div>
);

export default StoryCardBadges;
