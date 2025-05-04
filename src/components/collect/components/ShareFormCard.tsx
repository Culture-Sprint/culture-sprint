
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import ShareFormSection from "@/components/collect/ShareFormSection";

interface ShareFormCardProps {
  projectId: string | null;
  storyQuestion: string | null;
  sliderQuestions: any[];
  participantQuestions: any[];
}

const ShareFormCard: React.FC<ShareFormCardProps> = ({
  projectId,
  storyQuestion,
  sliderQuestions,
  participantQuestions
}) => {
  if (!projectId) return null;
  
  return (
    <Card className="border-opacity-50 shadow-md">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-primary">Share Form</h2>
          <InfoTooltip contentKey="collect-share-form" size={16} />
        </div>
      </CardHeader>
      <CardContent className="bg-white p-4 py-0">
        <ErrorBoundary>
          <ShareFormSection 
            storyQuestion={storyQuestion} 
            sliderQuestions={sliderQuestions} 
            participantQuestions={participantQuestions}
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};

export default ShareFormCard;
