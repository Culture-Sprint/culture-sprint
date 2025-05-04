
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ChatMessage } from "@/types/chatTypes";
import PatternHeader from "./pattern-insights/PatternHeader";
import CollapsedContent from "./pattern-insights/CollapsedContent";
import ExpandedContent from "./pattern-insights/ExpandedContent";
import EmptyContent from "./pattern-insights/EmptyContent";
import { createStoryDataContext } from "./pattern-insights/PatternContext";

interface PatternInsightsCardProps {
  stories: any[];
  projectName: string;
}

const PatternInsightsCard: React.FC<PatternInsightsCardProps> = ({ stories, projectName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoSendQuestion, setAutoSendQuestion] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const projectContext = createStoryDataContext({ stories, projectName });
  
  useEffect(() => {
    console.log("PatternInsightsCard render:", { 
      storiesAvailable: stories?.length > 0, 
      isExpanded,
      storiesCount: stories?.length,
      contextIncluded: !!projectContext
    });
  }, [stories?.length, isExpanded, projectContext]);
  
  const handleExpandClick = () => {
    setIsExpanded(true);
    setAutoSendQuestion(true);
  };
  
  const renderContent = () => {
    if (!stories || stories.length === 0) {
      return <EmptyContent />;
    }
    
    if (isExpanded) {
      return (
        <ExpandedContent
          projectContext={projectContext}
          autoSendQuestion={autoSendQuestion}
          onQuestionSent={() => setAutoSendQuestion(false)}
          onCollapse={() => setIsExpanded(false)}
          onChatContentChange={setChatMessages}
          chatMessages={chatMessages}
        />
      );
    }
    
    return <CollapsedContent onExpand={handleExpandClick} />;
  };

  return (
    <Card className="col-span-1 lg:col-span-3 shadow-md border border-[#7A0266] border-opacity-30">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
        <PatternHeader />
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-white to-culturesprint-50/20 rounded-b-md">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default PatternInsightsCard;
