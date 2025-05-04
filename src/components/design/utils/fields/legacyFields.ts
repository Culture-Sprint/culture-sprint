
import { FormField, ActivityField } from "./types";

/**
 * Legacy function to get activity fields based on step and activity IDs
 * @deprecated Use getQuestionFields instead
 */
export const getActivityFields = (stepId: string, activityId: string): ActivityField[] => {
  // Log deprecation warning
  console.warn('getActivityFields is deprecated. Please use getQuestionFields instead.');
  
  // Topic Step
  if (stepId === "topic") {
    if (activityId === "investigate") {
      return [{ id: "investigation_topic", label: "What topic are you investigating?", isTextarea: false }];
    } else if (activityId === "focus") {
      return [{ id: "topic_focus", label: "What is the focus of the topic? What is it specifically about?", isTextarea: false }];
    } else if (activityId === "actors") {
      return [{ id: "actors_involved", label: "Who are the actors that you want to hear from?", isTextarea: false }];
    }
  }
  // Discover Step
  else if (stepId === "discover") {
    if (activityId === "hopes") {
      return [{ id: "discovery_goal", label: "What is that you hope to discover at the end?", isTextarea: false }];
    } else if (activityId === "experiences") {
      return [{ id: "experience_types", label: "What kind of experiences would people have that most likely reveal the current state of the topic?", isTextarea: true }];
    } else if (activityId === "factors") {
      return [{ id: "influencing_factors", label: "What factors do you believe influence how people behave or decide around this topic?", isTextarea: true }];
    }
  }
  
  return [];
};
