
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/utils/story/formattingUtils";

interface Story {
  id: number | string;
  title: string;
  text: string;
  name?: string;
  feelingSentiment?: "positive" | "neutral" | "negative";
  date: string;
}

interface RecentStoriesCardProps {
  recentStories: Story[];
}

const RecentStoriesCard: React.FC<RecentStoriesCardProps> = ({ recentStories }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Stories</CardTitle>
        <CardDescription>
          The latest stories submitted to this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentStories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No stories submitted to this project yet
          </div>
        ) : (
          <div className="space-y-4">
            {recentStories.map(story => (
              <div key={story.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-base">{story.title}</h4>
                  <Badge className={
                    story.feelingSentiment === "positive" ? "bg-green-100 text-green-800" :
                    story.feelingSentiment === "negative" ? "bg-red-100 text-red-800" :
                    "bg-blue-100 text-blue-800"
                  }>
                    {story.feelingSentiment || "Unspecified"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                  {story.text}
                </p>
                <div className="text-xs text-gray-500">
                  <span>
                    {story.name ? `Shared by ${story.name}` : "Anonymous"}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatShortDate(story.date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentStoriesCard;
