
import { SliderTheme } from "@/components/design/defaultSliderThemes";

/**
 * Generates slider questions based on predefined templates and factors
 */
export const generateFromTemplates = async (factors: string[]): Promise<SliderTheme[]> => {
  // Enhanced question templates with more variety and emotional depth
  const questionTemplates = [
    // Impact-focused templates
    {
      baseTheme: "Impact",
      questionTemplate: "In your story, how significantly did FACTOR influence your experience?",
      leftLabel: "Not at all",
      rightLabel: "Significantly"
    },
    {
      baseTheme: "Change",
      questionTemplate: "How much did FACTOR change the course of events in your story?",
      leftLabel: "No change",
      rightLabel: "Complete shift"
    },
    // Emotional templates
    {
      baseTheme: "Perception",
      questionTemplate: "Based on your experience, how would you characterize the influence of FACTOR?",
      leftLabel: "Very negative",
      rightLabel: "Very positive"
    },
    {
      baseTheme: "Emotion",
      questionTemplate: "What emotions did FACTOR evoke in your experience?",
      leftLabel: "Distressing",
      rightLabel: "Uplifting"
    },
    // Agency templates
    {
      baseTheme: "Control",
      questionTemplate: "In your shared story, to what extent could you influence or direct FACTOR?",
      leftLabel: "No control",
      rightLabel: "Complete control"
    },
    {
      baseTheme: "Agency",
      questionTemplate: "How much personal power did you have over FACTOR in your experience?",
      leftLabel: "Powerless",
      rightLabel: "Fully empowered"
    },
    // Satisfaction templates
    {
      baseTheme: "Satisfaction",
      questionTemplate: "How satisfied were you with the outcome related to FACTOR?",
      leftLabel: "Very dissatisfied",
      rightLabel: "Very satisfied"
    },
    // Learning templates
    {
      baseTheme: "Learning",
      questionTemplate: "How much did you learn about FACTOR through this experience?",
      leftLabel: "Nothing new",
      rightLabel: "Deep insights"
    }
  ];
  
  let newThemes: SliderTheme[] = [];
  const factorsToUse = Math.min(factors.length, 3);
  
  // Create questions from available factors
  for (let i = 0; i < factorsToUse; i++) {
    const factor = factors[i];
    // Randomly select a template rather than cycling sequentially
    const templateIndex = Math.floor(Math.random() * questionTemplates.length);
    const baseTemplate = questionTemplates[templateIndex];
    
    // Better sanitization to preserve case but remove special characters
    const sanitizedFactor = factor.trim().replace(/['"]/g, '');
    
    const fullQuestion = baseTemplate.questionTemplate.replace("FACTOR", sanitizedFactor);
    
    newThemes.push({
      id: i + 1,
      theme: baseTemplate.baseTheme,
      question: fullQuestion,
      leftLabel: baseTemplate.leftLabel,
      rightLabel: baseTemplate.rightLabel,
      sliderValue: 50
    });
  }
  
  // Enhanced fallback questions when factors are missing
  if (newThemes.length < 3) {
    // More diverse and engaging generic templates
    const genericTemplates = [
      {
        theme: "Experience",
        question: "How would you rate your overall experience in the story you shared?",
        leftLabel: "Very negative",
        rightLabel: "Very positive"
      },
      {
        theme: "Personal Impact",
        question: "How much did the experience you described impact you personally?",
        leftLabel: "No impact",
        rightLabel: "Profound impact"
      },
      {
        theme: "Emotions",
        question: "How did the experience you shared make you feel emotionally?",
        leftLabel: "Very negative",
        rightLabel: "Very positive"
      },
      {
        theme: "Learning",
        question: "How much did you learn from the experience you shared?",
        leftLabel: "Nothing new",
        rightLabel: "Major insights"
      },
      {
        theme: "Surprise",
        question: "How surprised were you by what happened in your experience?",
        leftLabel: "Expected",
        rightLabel: "Completely unexpected"
      },
      {
        theme: "Resolution",
        question: "How satisfied are you with how the situation was resolved?",
        leftLabel: "Unsatisfied",
        rightLabel: "Fully satisfied"
      },
      {
        theme: "Connection",
        question: "How connected did you feel to others in your experience?",
        leftLabel: "Disconnected",
        rightLabel: "Deeply connected"
      },
      {
        theme: "Meaning",
        question: "How meaningful was this experience to you?",
        leftLabel: "Meaningless",
        rightLabel: "Deeply meaningful"
      }
    ];
    
    const remainingCount = 3 - newThemes.length;
    
    // Select random generic templates rather than sequentially
    const selectedTemplateIndices = new Set<number>();
    while (selectedTemplateIndices.size < remainingCount) {
      const randomIndex = Math.floor(Math.random() * genericTemplates.length);
      selectedTemplateIndices.add(randomIndex);
    }
    
    // Convert set to array and create themes
    Array.from(selectedTemplateIndices).forEach((templateIndex, index) => {
      const template = genericTemplates[templateIndex];
      newThemes.push({
        id: newThemes.length + 1,
        theme: template.theme,
        question: template.question,
        leftLabel: template.leftLabel,
        rightLabel: template.rightLabel,
        sliderValue: 50
      });
    });
  }
  
  return newThemes;
};
