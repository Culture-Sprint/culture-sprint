
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SentimentChartTabProps {
  feelingData: { name: string; value: number }[];
  totalStories: number;
}

const SentimentChartTab: React.FC<SentimentChartTabProps> = ({ feelingData, totalStories }) => {
  const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

  return (
    <Card className="shadow-md border-opacity-50">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
        <CardTitle className="text-primary">Story Sentiment Distribution</CardTitle>
        <CardDescription>
          Breakdown of stories by analyzed sentiment
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-white to-culturesprint-50 rounded-b-md">
        {totalStories === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No story data available for this project
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feelingData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feelingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="flex justify-center space-x-8 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Positive</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm">Neutral</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">Negative</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentChartTab;
