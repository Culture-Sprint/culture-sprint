
import React from "react";

interface PatternContextProps {
  stories: any[];
  projectName: string;
}

export const createStoryDataContext = ({ stories, projectName }: PatternContextProps): string => {
  if (stories.length === 0) return "";
  
  const storyCount = stories.length;
  const sentiments = {
    positive: stories.filter(s => s.feelingSentiment === "positive").length,
    neutral: stories.filter(s => s.feelingSentiment === "neutral").length,
    negative: stories.filter(s => s.feelingSentiment === "negative").length
  };
  
  const avgImpact = stories
    .filter(s => typeof s.impact === 'number')
    .reduce((sum, s) => sum + (s.impact as number), 0) / 
    stories.filter(s => typeof s.impact === 'number').length || 0;
  
  const sliderQuestions = new Set<string>();
  stories.forEach(story => {
    if (story.sliderResponses && story.sliderResponses.length > 0) {
      story.sliderResponses.forEach((resp: { question_text: string }) => {
        sliderQuestions.add(resp.question_text);
      });
    }
  });
  
  // Build the base context using project context builder
  let context = buildProjectContext({
    projectName,
    storyData: {
      storyCount,
      sentiments,
      avgImpact: avgImpact.toFixed(1),
      sliderQuestions: Array.from(sliderQuestions) as string[],
      hasSliderData: sliderQuestions.size > 0
    }
  });
  
  // Adding complete story content 
  context += "\n\nCOMPLETE STORY CONTENT:\n";
  stories.slice(0, 30).forEach((story, index) => {
    context += `Story ${index + 1}: "${story.title}" - Feeling: ${story.feeling}\n`;
    context += `Full text: ${story.text}\n`;
    
    // Add slider responses if available
    if (story.sliderResponses && story.sliderResponses.length > 0) {
      context += "Slider responses:\n";
      story.sliderResponses.forEach((resp: { question_text: string, value: number }) => {
        context += `- ${resp.question_text}: ${resp.value}\n`;
      });
    }
    
    // Add participant responses if available
    if (story.participantResponses && story.participantResponses.length > 0) {
      context += "Participant responses:\n";
      story.participantResponses.forEach((resp: { question_text: string, response: string }) => {
        context += `- ${resp.question_text}: ${resp.response}\n`;
      });
    }
    
    context += "\n"; // Add space between stories
  });
  
  if (stories.length > 30) {
    context += `[Additional ${stories.length - 30} stories not included due to length constraints]\n`;
  }
  
  return context;
};

import { buildProjectContext } from "@/utils/project-context";
