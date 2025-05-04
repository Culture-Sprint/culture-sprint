
import React from "react";
import { Users } from "lucide-react";
import StatsCard from "../StatsCard";
import { calculatePredominantSentiment } from "@/utils/dashboardUtils";

interface SentimentStatsCardProps {
  totalStories: number;
  positiveStories: number;
  neutralStories: number;
  negativeStories: number;
}

const SentimentStatsCard: React.FC<SentimentStatsCardProps> = ({
  totalStories,
  positiveStories,
  neutralStories,
  negativeStories
}) => {
  const { 
    predominantSentiment, 
    predominantPercentage, 
    sentimentBadgeClass 
  } = calculatePredominantSentiment(
    totalStories,
    positiveStories,
    neutralStories,
    negativeStories
  );

  return (
    <StatsCard
      title="Sentiment Breakdown"
      value={predominantSentiment}
      subtitle="Predominant sentiment in stories"
      icon={Users}
      badge={totalStories > 0 ? {
        text: `${predominantPercentage}%`,
        className: sentimentBadgeClass
      } : undefined}
    />
  );
};

export default SentimentStatsCard;
