
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Story } from "@/types/story";

interface ParticipantResponsesTabProps {
  stories: Story[];
  questionId: string;
  questionText: string;
  totalStories: number;
}

const ParticipantResponsesTab: React.FC<ParticipantResponsesTabProps> = ({
  stories,
  questionId,
  questionText,
  totalStories
}) => {
  const responseData = useMemo(() => {
    const responseCounts: Record<string, number> = {};
    
    stories.forEach(story => {
      if (story.participantResponses) {
        const response = story.participantResponses.find(
          r => r.question_id === questionId
        );
        
        if (response && response.response) {
          responseCounts[response.response] = (responseCounts[response.response] || 0) + 1;
        }
      }
    });
    
    return Object.entries(responseCounts).map(([response, count]) => ({
      response,
      count
    }));
  }, [stories, questionId]);
  
  // Sort data by count (descending)
  const sortedData = [...responseData].sort((a, b) => b.count - a.count);
  
  // Generate colors using the website's color palette
  const colors = [
    "#180572", // Primary brand color - deep purple
    "#E2005A", // Secondary brand color - bright pink
    "#9995C2", // Accent color - light purple
    "#7A0266", // Tertiary color - dark pink
    "#605897", // culturesprint-500
    "#c7c3e3", // culturesprint-200
    "#e3e1f1", // culturesprint-100
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#f59e0b", // amber-500
  ];

  return (
    <Card className="shadow-md border-culturesprint-100 overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100 pb-4">
        <CardTitle className="text-primary text-xl font-bold">{questionText}</CardTitle>
        <CardDescription className="text-gray-600 mt-1">
          Distribution of responses ({sortedData.length} different responses)
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-4 pt-6 h-[calc(100%-90px)]">
        {totalStories === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-md border border-gray-100">
            <div className="text-center p-6">
              <p className="font-medium mb-2">No story data available</p>
              <p className="text-sm text-gray-400">Add stories to see analytics for this project</p>
            </div>
          </div>
        ) : responseData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-md border border-gray-100">
            <div className="text-center p-6">
              <p className="font-medium mb-2">No responses for this question</p>
              <p className="text-sm text-gray-400">Participants haven't answered this question yet</p>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedData} margin={{ top: 5, right: 20, left: 10, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="response" 
                  tick={{ fontSize: 12, fill: "#555" }}
                  interval={0}
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 12, fill: "#555" }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} stories`, 'Count']}
                  labelFormatter={(label) => `Response: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderColor: '#ddd',
                    borderRadius: '6px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1200}
                  animationBegin={300}
                >
                  {sortedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      fillOpacity={0.9}
                      stroke={colors[index % colors.length]}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParticipantResponsesTab;
