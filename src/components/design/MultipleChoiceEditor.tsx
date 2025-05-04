
import React, { useState } from "react";
import { useToast } from "@/hooks/toast";
import QuestionEditor from "./multiple-choice/QuestionEditor";
import QuestionSummary from "./multiple-choice/QuestionSummary";
import { MultipleChoiceQuestion } from "./multiple-choice/types";

interface MultipleChoiceEditorProps {
  selectedQuestions: { id: string; label: string }[];
  onComplete: (questions: MultipleChoiceQuestion[]) => void;
  existingQuestions?: MultipleChoiceQuestion[];
}

const MultipleChoiceEditor: React.FC<MultipleChoiceEditorProps> = ({
  selectedQuestions,
  onComplete,
  existingQuestions = [],
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [newChoice, setNewChoice] = useState("");
  
  // Merge existing questions with new ones
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>(() => {
    // Create a map of existing questions by ID for faster lookup
    const existingQuestionsMap = new Map(
      existingQuestions.map(q => [q.id, q])
    );
    
    // For each selected question, use existing data if available or create new
    return selectedQuestions.map(q => {
      const existing = existingQuestionsMap.get(q.id);
      return existing || { ...q, choices: [] };
    });
  });
  
  const [showingSummary, setShowingSummary] = useState(false);
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  const handleAddChoice = () => {
    if (!newChoice.trim()) return;
    
    const choiceId = newChoice.toLowerCase().replace(/\s+/g, "-");
    
    // Check if this choice already exists
    if (currentQuestion.choices.some(c => c.id === choiceId)) {
      toast({
        title: "Duplicate choice",
        description: "This choice already exists for this question.",
        variant: "destructive",
      });
      return;
    }
    
    setQuestions(
      questions.map((q, i) =>
        i === currentQuestionIndex
          ? {
              ...q,
              choices: [...q.choices, { id: choiceId, label: newChoice }],
            }
          : q
      )
    );
    
    setNewChoice("");
  };

  const handleRemoveChoice = (choiceId: string) => {
    setQuestions(
      questions.map((q, i) =>
        i === currentQuestionIndex
          ? {
              ...q,
              choices: q.choices.filter((c) => c.id !== choiceId),
            }
          : q
      )
    );
  };

  const handleEditChoice = (choiceId: string, newLabel: string) => {
    // Check if the new label would create a duplicate (excluding the current choice)
    const newChoiceId = newLabel.toLowerCase().replace(/\s+/g, "-");
    const isDuplicate = currentQuestion.choices.some(
      c => c.id !== choiceId && (c.id === newChoiceId || c.label === newLabel)
    );
    
    if (isDuplicate) {
      toast({
        title: "Duplicate choice",
        description: "A choice with this name already exists for this question.",
        variant: "destructive",
      });
      return;
    }

    setQuestions(
      questions.map((q, i) =>
        i === currentQuestionIndex
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.id === choiceId
                  ? { id: newChoiceId, label: newLabel }
                  : c
              ),
            }
          : q
      )
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestion.choices.length === 0) {
      toast({
        title: "No choices added",
        description: "Please add at least one choice for this question.",
        variant: "destructive",
      });
      return;
    }
    
    if (isLastQuestion) {
      setShowingSummary(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    onComplete(questions);
  };

  if (showingSummary) {
    return (
      <QuestionSummary 
        questions={questions}
        onFinish={handleFinish}
      />
    );
  }

  return (
    <QuestionEditor
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={questions.length}
      newChoice={newChoice}
      onNewChoiceChange={setNewChoice}
      onAddChoice={handleAddChoice}
      onRemoveChoice={handleRemoveChoice}
      onEditChoice={handleEditChoice}
      onPrevious={handlePreviousQuestion}
      onNext={handleNextQuestion}
      isLastQuestion={isLastQuestion}
    />
  );
};

export default MultipleChoiceEditor;
