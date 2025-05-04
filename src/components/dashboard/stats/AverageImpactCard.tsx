
import React from "react";
import { TrendingUp } from "lucide-react";
import StatsCard from "../StatsCard";

interface AverageImpactCardProps {
  averageImpact: string;
}

const AverageImpactCard: React.FC<AverageImpactCardProps> = ({ averageImpact }) => {
  return (
    <StatsCard
      title="Average Impact"
      value={`${averageImpact}/10`}
      subtitle="Average significance rating"
      icon={TrendingUp}
    />
  );
};

export default AverageImpactCard;
