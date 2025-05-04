
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ImpactChartTabProps {
  impactData: { impact: number; count: number }[];
  totalStories: number;
}

const ImpactChartTab: React.FC<ImpactChartTabProps> = ({ impactData, totalStories }) => {
  return (
    <Card className="shadow-md border-opacity-50">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
        <CardTitle className="text-primary">Impact Rating Distribution</CardTitle>
        <CardDescription>
          Number of stories by reported significance level (1-10)
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-white to-culturesprint-50 rounded-b-md">
        {totalStories === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No story data available for this project
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="impact" label={{ value: 'Impact Level', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Number of Stories', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#180572" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImpactChartTab;
