
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { AIDebugInfo } from '@/hooks/slider-questions/sliderQuestionAIGenerator';
import DebuggerDialog from './debugger/DebuggerDialog';
import { useUserRole } from "@/hooks/useUserRole";

interface SliderQuestionDebuggerProps {
  debugInfo: AIDebugInfo | null;
}

const SliderQuestionDebugger: React.FC<SliderQuestionDebuggerProps> = ({ debugInfo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isSuperAdmin } = useUserRole();
  
  if (!debugInfo || !isSuperAdmin()) return null;
  
  const contextLength = debugInfo.context ? debugInfo.context.length : 0;
  const contextSections = debugInfo.context ? debugInfo.context.split('\n\n').length : 0;
  
  return (
    <div 
      className="inline-flex items-center" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-xs text-gray-500 mr-2">
        {isHovered ? `Context: ${contextLength} chars, ${contextSections} sections` : 'Debug Info'}
      </span>
      <DebuggerDialog debugInfo={debugInfo} />
    </div>
  );
};

export default SliderQuestionDebugger;
