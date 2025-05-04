
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Story Density Contour Chart
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] flex items-center justify-center">
        <div className="text-gray-500">No stories available to visualize</div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
