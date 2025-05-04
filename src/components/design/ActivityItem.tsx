import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Play, Circle, CheckCircle } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ActivityFormData, isActivityComplete } from "@/types/activity";
import ActivityContent from "./ActivityContent";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface DesignActivity {
  id: string;
  title: string;
  description: string;
  component?: React.ReactNode;
  hideActivityContent?: boolean;
}

interface ActivityItemProps {
  activity: DesignActivity;
  activityData: ActivityFormData | undefined;
  onStartActivity: (activityId: string) => void;
  isTemplateProject?: boolean;
  status?: "complete" | "incomplete" | "in_progress" | "error";
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity, 
  activityData, 
  onStartActivity,
  isTemplateProject = false,
  status = "incomplete"
}) => {
  const projectId = localStorage.getItem('activeProjectId');
  
  const isCompleted = isActivityComplete(activity.id, activityData);
  
  const isFormBuilderCompleted = activity.id === "form-builder" && 
    (localStorage.getItem('form-builder_completed') === 'true');

  const isStoryQuestionActivity = activity.id === "story-questions";
  
  const isStoryQuestionCompleted = isStoryQuestionActivity ? 
    (localStorage.getItem(`culturesprint_story_question_saved_${projectId}`) === 'true') : 
    isCompleted;
    
  const isSliderQuestionsActivity = activity.id === "slider-questions";
  const isSliderQuestionsCompleted = isSliderQuestionsActivity ?
    (localStorage.getItem(`sliderThemesSaved_${projectId}`) === 'true' || 
     localStorage.getItem('sliderThemesSaved') === 'true') :
    isCompleted;
    
  const isParticipantQuestionsActivity = activity.id === "participant-questions";
  const isParticipantQuestionsCompleted = isParticipantQuestionsActivity ?
    (localStorage.getItem(`participantQuestionsSaved_${projectId}`) === 'true' || 
     localStorage.getItem('participantQuestionsSaved') === 'true') :
    isCompleted;
  
  const finalCompletionStatus = 
    isStoryQuestionActivity ? isStoryQuestionCompleted :
    isSliderQuestionsActivity ? isSliderQuestionsCompleted :
    isParticipantQuestionsActivity ? isParticipantQuestionsCompleted :
    (isCompleted || isFormBuilderCompleted);

  return (
    <AccordionItem key={activity.id} value={activity.id}>
      <AccordionTrigger className="hover:text-culturesprint-600">
        <div className="flex items-center gap-2">
          {finalCompletionStatus ? (
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          ) : (
            <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />
          )}
          <span className="flex items-center gap-1">
            {activity.title}
            {isStoryQuestionActivity && (
              <InfoTooltip contentKey="design-story-question" size={14} />
            )}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-4 bg-culturesprint-50 rounded-md">
          <p className="text-gray-700">{activity.description}</p>
          
          {finalCompletionStatus && activityData ? (
            <ActivityContent 
              activityData={activityData} 
              onEdit={() => onStartActivity(activity.id)}
              hideContent={activity.hideActivityContent}
            />
          ) : null}
          
          {activity.component && (
            <div className="mt-4">
              {activity.component}
            </div>
          )}
          
          {!finalCompletionStatus && !activity.component && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className={activityData && Object.keys(activityData).length > 0 ? 
                  "text-culturesprint-600 border-culturesprint-600 flex items-center gap-1" : 
                  "text-white bg-culturesprint-600 border-culturesprint-600 hover:bg-culturesprint-700 hover:border-culturesprint-700 flex items-center gap-1"}
                onClick={() => onStartActivity(activity.id)}
              >
                {activityData && Object.keys(activityData).length > 0 ? (
                  <>
                    <Pencil size={14} />
                    Edit this Activity
                  </>
                ) : (
                  <>
                    <Play size={14} color="white" /> 
                    Start this activity
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ActivityItem;
