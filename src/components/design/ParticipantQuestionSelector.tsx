
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import OptionSelector from "./participants/OptionSelector";
import SelectedOptionsDisplay from "./participants/SelectedOptionsDisplay";
import { useParticipantQuestions } from "@/hooks/useParticipantQuestions";
import { useProject } from "@/contexts/ProjectContext";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useUserRole } from "@/hooks/useUserRole";

const ParticipantQuestionSelector: React.FC = () => {
  const { activeProject } = useProject();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { isSuperAdmin } = useUserRole();

  const {
    options,
    otherOptions,
    newOption,
    setNewOption,
    showAddField,
    setShowAddField,
    isDefiningChoices,
    definedQuestions,
    handleToggleOption,
    handleToggleOtherOption,
    handleAddOption,
    handleRemoveOption,
    handleDefineChoices,
    handleChoicesComplete,
    getSelectedOptions,
    refreshQuestions
  } = useParticipantQuestions();

  useEffect(() => {
    const savedState = localStorage.getItem('participantQuestionsSaved') === 'true';
    setIsSaved(savedState);
  }, [definedQuestions]);

  useEffect(() => {
    if (activeProject?.id) {
      setIsLoading(true);
      console.log("ParticipantQuestionSelector: Initial load for project", activeProject.id);
      
      refreshQuestions().finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [activeProject?.id]);

  const handleManualRefresh = () => {
    if (activeProject?.id && !isRefreshing) {
      setIsRefreshing(true);
      console.log("ParticipantQuestionSelector: Manual refresh requested for project", activeProject.id);
      
      refreshQuestions().finally(() => {
        setIsRefreshing(false);
      });
    }
  };

  const selectedOptions = getSelectedOptions();

  if (isDefiningChoices) {
    return (
      <MultipleChoiceEditor 
        selectedQuestions={selectedOptions}
        onComplete={handleChoicesComplete}
        existingQuestions={definedQuestions}
      />
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg text-brand-primary">Select Participant Information to Collect</CardTitle>
          <InfoTooltip contentKey="design-participant-questions" size={16} />
        </div>
        {!isDefiningChoices && isSuperAdmin() && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh}
            disabled={isLoading || isRefreshing}
          >
            {isLoading || isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6 bg-white p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <OptionSelector 
              options={options}
              otherOptions={otherOptions}
              newOption={newOption}
              showAddField={showAddField}
              onToggleOption={handleToggleOption}
              onToggleOtherOption={handleToggleOtherOption}
              onRemoveOption={handleRemoveOption}
              onAddOption={handleAddOption}
              onNewOptionChange={setNewOption}
              onShowAddFieldChange={setShowAddField}
            />
            
            <SelectedOptionsDisplay 
              selectedOptions={selectedOptions}
              definedQuestions={definedQuestions}
              onDefineChoices={handleDefineChoices}
            />
            
            {isSaved && definedQuestions.length > 0 && (
              <div className="mt-2 bg-green-50 p-3 rounded-md border border-green-100 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">Participant questions saved successfully.</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ParticipantQuestionSelector;
