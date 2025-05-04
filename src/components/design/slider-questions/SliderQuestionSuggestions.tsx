
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemePolarity from "../ThemePolarity";
import { useProject } from "@/contexts/ProjectContext";
import { useSliderQuestions } from "@/hooks/useSliderQuestions";
import SavedSuccessState from "./SavedSuccessState";
import InfoTip from "./InfoTip";
import SaveChangesButton from "./SaveChangesButton";
import GenerateFactorsButton from "./GenerateFactorsButton";
import FactorsWarning from "./FactorsWarning";
import SliderQuestionDebugger from "./SliderQuestionDebugger";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useUserRole } from "@/hooks/useUserRole";
import { useInfluencingFactors } from "@/services/factors/useInfluencingFactors";

interface SliderQuestionSuggestionsProps {
  isTemplateProject?: boolean;
}

const SliderQuestionSuggestions: React.FC<SliderQuestionSuggestionsProps> = ({ 
  isTemplateProject = false 
}) => {
  const { activeProject } = useProject();
  const [showFactorsWarning, setShowFactorsWarning] = useState(false);
  const componentMounted = useRef(false);
  const { isSuperAdmin } = useUserRole();
  const factorService = useInfluencingFactors(activeProject?.id || '');
  
  const {
    suggestedThemes,
    editingThemeId,
    editedThemes,
    showTip,
    allChangesSaved,
    loading,
    isRefreshing,
    lastDebugInfo,
    handleEditTheme,
    handleSaveTheme,
    handleCancelEdit,
    handleSaveAll,
    generateFactorBasedQuestions,
    refreshThemes
  } = useSliderQuestions(activeProject?.id || '', isTemplateProject);

  // Log the current state for debugging
  useEffect(() => {
    console.log("SliderQuestionSuggestions state:", {
      themesCount: suggestedThemes.length,
      editingThemeId,
      editedThemesCount: editedThemes.size,
      allChangesSaved,
      isTemplateProject
    });
  }, [suggestedThemes, editingThemeId, editedThemes, allChangesSaved, isTemplateProject]);

  useEffect(() => {
    componentMounted.current = true;
    
    return () => {
      componentMounted.current = false;
    };
  }, []);

  const handleGenerateQuestions = async () => {
    console.log("Generate button clicked");
    try {
      const result = await generateFactorBasedQuestions();
      console.log("Generation result:", result);
      setShowFactorsWarning(result?.factorsMissing || false);
    } catch (error) {
      console.error("Error generating questions:", error);
      setShowFactorsWarning(true);
    }
  };
  
  const handleRetryFactorDetection = async () => {
    try {
      // Force refresh when retrying factor detection
      const factors = await factorService.getInfluencingFactors(true);
      if (factors && factors.length > 0) {
        // If we found factors, regenerate questions
        const result = await generateFactorBasedQuestions();
        setShowFactorsWarning(result?.factorsMissing || false);
      } else {
        // Still no factors found
        setShowFactorsWarning(true);
      }
    } catch (error) {
      console.error("Error retrying factor detection:", error);
      setShowFactorsWarning(true);
    }
  };

  // Create an adapter function to match ThemePolarity's expected function signature
  const handleSaveThemeAdapter = (id: number, theme: string, question: string, leftLabel: string, rightLabel: string, sliderValue?: number) => {
    const updatedTheme = {
      id,
      theme,
      question,
      leftLabel,
      rightLabel,
      sliderValue: sliderValue || 50
    };
    
    handleSaveTheme(id, updatedTheme);
  };

  return (
    <Card className={`bg-white shadow-sm ${allChangesSaved && editedThemes.size === 0 ? "border-green-100" : "border-gray-100"} transition-colors duration-500`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Slider Themes for Story Responses</CardTitle>
          <InfoTooltip contentKey="design-slider-questions" size={16} />
        </div>
        <div className="flex space-x-2">
          {lastDebugInfo && isSuperAdmin() && (
            <SliderQuestionDebugger debugInfo={lastDebugInfo} />
          )}
          {isSuperAdmin() && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refreshThemes()}
              disabled={loading || factorService.isLoading}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : "Refresh Data"}
            </Button>
          )}
          {!isTemplateProject && (
            <GenerateFactorsButton 
              onClick={handleGenerateQuestions} 
              loading={loading || factorService.isLoading} 
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          These slider questions can be used to gather additional insights from participants after they share their stories.
          Click the edit button to customize each theme, question, and scale labels.
        </p>
        
        <FactorsWarning 
          show={showFactorsWarning} 
          onRefresh={handleRetryFactorDetection}
        />
        
        {loading || factorService.isLoading ? (
          <div className="py-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600">Loading slider questions...</span>
          </div>
        ) : suggestedThemes.length > 0 ? (
          <>
            <div className="space-y-6">
              {suggestedThemes.map((theme) => (
                <ThemePolarity
                  key={theme.id}
                  id={theme.id}
                  theme={theme.theme}
                  question={theme.question}
                  leftLabel={theme.leftLabel}
                  rightLabel={theme.rightLabel}
                  sliderValue={theme.sliderValue || 50}
                  onEdit={handleEditTheme}
                  onSave={handleSaveThemeAdapter}
                  onCancel={handleCancelEdit}
                  isEditing={editingThemeId === theme.id}
                />
              ))}
            </div>
            
            <SaveChangesButton 
              editedThemesCount={editedThemes.size} 
              onSaveAll={handleSaveAll} 
              allChangesSaved={allChangesSaved && editedThemes.size === 0}
            />
          </>
        ) : (
          <div className="py-6 text-center border rounded-md bg-gray-50">
            <p className="text-gray-500">No slider questions found. Generate some or create them manually.</p>
          </div>
        )}
        
        <SavedSuccessState isVisible={allChangesSaved && editedThemes.size === 0} />
        
        <InfoTip showTip={showTip} allChangesSaved={allChangesSaved && editedThemes.size === 0} />
      </CardContent>
    </Card>
  );
};

export default SliderQuestionSuggestions;
