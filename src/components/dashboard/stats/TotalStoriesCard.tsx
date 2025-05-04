
import React from "react";
import { BookOpen } from "lucide-react";
import StatsCard from "../StatsCard";

interface TotalStoriesCardProps {
  totalStories: number;
}

const TotalStoriesCard: React.FC<TotalStoriesCardProps> = ({ totalStories }) => {
  return (
    <StatsCard
      title="Total Stories"
      value={totalStories}
      subtitle={totalStories > 0 ? "Stories collected" : "No stories yet"}
      icon={BookOpen}
    />
  );
};

export default TotalStoriesCard;
