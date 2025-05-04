
import React, { useEffect } from "react";
import { useForm } from "@/contexts/form";
import StoryQuestion from "@/components/collect/form-fields/StoryQuestion";
import SliderQuestions from "@/components/collect/form-fields/SliderQuestions";
import ParticipantQuestions from "@/components/collect/form-fields/ParticipantQuestions";
import AdditionalComments from "@/components/collect/form-fields/AdditionalComments";
import SubmitButton from "@/components/collect/SubmitButton";
import StoryTitle from "./StoryTitle";
import EmotionalResponse from "./EmotionalResponse";

// Update the props interface to include isPublic
interface StoryFormProps {
  isPublic?: boolean;
}

const StoryForm: React.FC<StoryFormProps> = ({ isPublic = false }) => {
  const { 
    handleSubmit,
    sliderQuestions,
    participantQuestions,
    isSubmitting,
    feeling,
    setFeeling,
    otherFeeling,
    setOtherFeeling,
    additionalComments,
    setAdditionalComments,
    handleParticipantAnswerChange,
    participantAnswers,
    sliderValues,
    handleSliderChange,
    touchedSliders,
    setTouchedSliders
  } = useForm();

  // Debug effect for participant questions and answers
  useEffect(() => {
    console.log("StoryForm rendered with:", {
      isPublic,
      sliderQuestionsCount: sliderQuestions?.length || 0,
      participantQuestionsCount: participantQuestions?.length || 0,
      participantQuestions,
      participantAnswers,
      sliderQuestions,
      sliderValues
    });
  }, [isPublic, participantQuestions, participantAnswers, sliderQuestions, sliderValues]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Use appropriate form spacing and styling for public forms */}
      <div className={`space-y-6 ${isPublic ? 'px-2 md:px-4' : ''}`}>
        {/* First show the StoryQuestion component */}
        <StoryQuestion isPublic={isPublic} />
        
        {/* Then show the StoryTitle component */}
        <StoryTitle isPublic={isPublic} />
        
        {/* Add the EmotionalResponse component */}
        <EmotionalResponse 
          feeling={feeling}
          otherFeeling={otherFeeling}
          onFeelingChange={setFeeling}
          onOtherFeelingChange={setOtherFeeling}
          isPublic={isPublic}
        />
        
        {/* Add slider questions if available */}
        {sliderQuestions && sliderQuestions.length > 0 && (
          <SliderQuestions 
            questions={sliderQuestions}
            sliderValues={sliderValues}
            onSliderChange={handleSliderChange}
            touchedSliders={touchedSliders}
            setTouchedSliders={setTouchedSliders}
            isPublic={isPublic}
          />
        )}
        
        {/* Add participant questions if available - double check with console log */}
        {participantQuestions && Array.isArray(participantQuestions) && participantQuestions.length > 0 && (
          <>
            {console.log("Rendering participant questions:", participantQuestions)}
            <ParticipantQuestions 
              participantQuestions={participantQuestions}
              participantAnswers={participantAnswers}
              onAnswerChange={handleParticipantAnswerChange}
              isPublic={isPublic}
            />
          </>
        )}
        
        {/* Add additional comments section */}
        <AdditionalComments
          value={additionalComments || ""}
          onChange={(e) => setAdditionalComments(e.target.value)}
          isPublic={isPublic}
        />
      </div>
      
      <SubmitButton isSubmitting={isSubmitting} isPublic={isPublic} />
    </form>
  );
};

export default StoryForm;
