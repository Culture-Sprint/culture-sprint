
import { useState, useEffect } from "react";
import { getLastDebugInfo, AIDebugInfo } from "./sliderQuestionAIGenerator";

export const useDebugInfo = (factorBasedQuestionsDebugInfo: AIDebugInfo | null) => {
  const [lastDebugInfo, setLastDebugInfo] = useState<AIDebugInfo | null>(null);

  // Update lastDebugInfo whenever it changes in the generator
  useEffect(() => {
    const checkDebugInfo = () => {
      const currentDebugInfo = getLastDebugInfo();
      if (currentDebugInfo !== lastDebugInfo) {
        setLastDebugInfo(currentDebugInfo);
      }
    };
    
    // Check immediately
    checkDebugInfo();
    
    // And after generation might have happened
    if (factorBasedQuestionsDebugInfo) {
      setLastDebugInfo(factorBasedQuestionsDebugInfo);
    }
  }, [factorBasedQuestionsDebugInfo, lastDebugInfo]);

  return {
    lastDebugInfo,
    setLastDebugInfo
  };
};
