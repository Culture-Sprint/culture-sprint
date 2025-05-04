
import React from "react";

interface DataPointStatsProps {
  filteredCount: number;
  totalCount: number;
}

const DataPointStats: React.FC<DataPointStatsProps> = ({ filteredCount, totalCount }) => {
  return (
    <div className="text-right text-sm">
      <p className="font-medium">Showing:</p>
      <p>{filteredCount} of {totalCount} points</p>
    </div>
  );
};

export default DataPointStats;
