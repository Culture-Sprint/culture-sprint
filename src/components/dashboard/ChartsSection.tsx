import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SentimentChartTab from "./SentimentChartTab";
import ParticipantResponsesTab from "./ParticipantResponsesTab";
import { Story } from "@/types/story";
interface ChartsSectionProps {
  feelingData: {
    name: string;
    value: number;
  }[];
  totalStories: number;
  stories: Story[];
}
const ChartsSection: React.FC<ChartsSectionProps> = ({
  feelingData,
  totalStories,
  stories
}) => {
  const [participantQuestions, setParticipantQuestions] = useState<{
    id: string;
    question: string;
  }[]>([]);
  useEffect(() => {
    if (stories.length === 0) return;
    const questionsMap = new Map<string, string>();
    stories.forEach(story => {
      if (story.participantResponses) {
        story.participantResponses.forEach(response => {
          if (response.question_id && response.question_text) {
            questionsMap.set(response.question_id, response.question_text);
          }
        });
      }
    });
    const extractedQuestions = Array.from(questionsMap).map(([id, question]) => ({
      id,
      question
    }));
    setParticipantQuestions(extractedQuestions);
  }, [stories]);
  return <div className="col-span-2 h-full">
      <Tabs defaultValue="sentiment" className="h-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:flex lg:flex-wrap mb-4 bg-culturesprint-100">
          <TabsTrigger value="sentiment" className="md:col-span-1">Sentiment</TabsTrigger>
          
          {participantQuestions.map((question, index) => <TabsTrigger key={question.id} value={`question-${question.id}`} className="md:col-span-1">
              {question.question.length > 20 ? `${question.question.substring(0, 20)}...` : question.question}
            </TabsTrigger>)}
        </TabsList>
        
        <div className="h-[calc(100%-60px)]">
          <TabsContent value="sentiment" className="h-full mt-0">
            <SentimentChartTab feelingData={feelingData} totalStories={totalStories} />
          </TabsContent>
          
          {participantQuestions.map(question => <TabsContent key={`content-${question.id}`} value={`question-${question.id}`} className="h-full mt-0">
              <ParticipantResponsesTab stories={stories} questionId={question.id} questionText={question.question} totalStories={totalStories} />
            </TabsContent>)}
        </div>
      </Tabs>
    </div>;
};
export default ChartsSection;