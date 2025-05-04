
import React from "react";
import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

interface PhaseItem {
  id: string;
  title: string;
}

interface PhaseProgressProps {
  phases: PhaseItem[];
  currentPhase: string;
  onSelectPhase: (phaseId: string) => void;
}

const PhaseProgress: React.FC<PhaseProgressProps> = ({ 
  phases, 
  currentPhase, 
  onSelectPhase 
}) => {
  // Find the index of the current phase to determine completed phases
  const currentIndex = phases.findIndex(phase => phase.id === currentPhase);
  
  // Calculate progress percentage for the progress bar
  const progressPercentage = Math.max(0, ((currentIndex) / (phases.length - 1)) * 100);
  
  return (
    <div className="mb-8">
      {/* Phase indicators and progress line */}
      <div className="relative flex items-center justify-between px-12">
        {/* Progress line */}
        <div className="absolute h-0.5 bg-gray-200 left-0 right-0 top-1/2 transform -translate-y-1/2 z-0"></div>
        
        {/* Filled progress line - animated */}
        <div 
          className="absolute h-0.5 bg-primary left-0 top-1/2 transform -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        
        {/* Phase dots */}
        {phases.map((phase, index) => {
          const isActive = phase.id === currentPhase;
          const isCompleted = index < currentIndex;
          
          // Remove the isClickable condition to make all circles clickable
          
          return (
            <div key={phase.id} className="z-10">
              <button
                onClick={() => onSelectPhase(phase.id)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-sm",
                  isActive 
                    ? "bg-primary text-white scale-110 ring-4 ring-primary/20 z-20" 
                    : isCompleted
                      ? "bg-primary text-white hover:bg-primary/90 hover:scale-105 z-20"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300",
                  "cursor-pointer" // Always show cursor pointer
                )}
                title={phase.title}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : isActive ? (
                  <div className="h-2.5 w-2.5 bg-white rounded-full animate-pulse" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseProgress;
