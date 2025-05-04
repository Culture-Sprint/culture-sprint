
import React from "react";
import { PenTool } from "lucide-react";
import { DesignPhase } from "../types/designTypes";
import SliderQuestionSuggestions from "@/components/design/slider-questions/SliderQuestionSuggestions";
import ParticipantQuestionSelector from "@/components/design/ParticipantQuestionSelector";
import DesignAssistant from "@/components/design/DesignAssistant";
import StoryQuestionSection from "@/components/design/StoryQuestionSection";

export const designPhase: DesignPhase = {
  id: "design",
  title: "Design",
  description: "Define the questions to ask",
  icon: <PenTool className="h-5 w-5" />,
  steps: [
    {
      id: "story-question",
      title: "Story Question",
      description: "Define the question that would elicit experiences",
      activities: [
        {
          id: "story-questions",
          title: "Story Question",
          description: "Design the main question that will elicit stories",
          component: <StoryQuestionSection projectId="" /> // We'll use an empty string here as a placeholder; the actual projectId will be provided at runtime
        }
      ]
    },
    {
      id: "form-questions",
      title: "Form Questions",
      description: "Define slider and participant questions",
      activities: [
        {
          id: "slider-questions",
          title: "Slider Questions",
          description: "Design questions that will gather stories from participants",
          component: <SliderQuestionSuggestions />
        },
        {
          id: "participant-questions",
          title: "Participant Questions",
          description: "Design questions that will gather information about participants",
          component: <ParticipantQuestionSelector />
        }
      ]
    }
  ]
};
