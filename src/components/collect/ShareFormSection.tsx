import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useFormSave } from "@/hooks/collect/useFormSave";
import { useFormLink } from "@/hooks/collect/useFormLink";
import ShareFormSaveButton from "@/components/collect/ShareFormSaveButton";
import ShareFormLinkButtons from "@/components/collect/ShareFormLinkButtons";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Share2, Link, AlertCircle, Loader2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { getPublicFormBaseUrl } from "@/utils/urlUtils";
interface ShareFormSectionProps {
  storyQuestion: string;
  sliderQuestions: any[];
  participantQuestions: any[];
}
const ShareFormSection: React.FC<ShareFormSectionProps> = ({
  storyQuestion,
  sliderQuestions,
  participantQuestions
}) => {
  const {
    toast
  } = useToast();
  const {
    activeProject
  } = useProject();
  const [isLinkReady, setIsLinkReady] = useState(false);
  const {
    isSaving,
    publicLink,
    handleSaveFormConfiguration
  } = useFormSave(storyQuestion, sliderQuestions, participantQuestions);
  const {
    copied,
    formId,
    isGenerating,
    isRevoking,
    handleCopyLink,
    handleOpenInNewTab,
    handleRevokeLink,
    ensureFormIdExists
  } = useFormLink();

  // Check if we have a form ID on load and after saving
  useEffect(() => {
    if (formId) {
      setIsLinkReady(true);
    } else {
      setIsLinkReady(false);
    }
  }, [formId]);
  const saveAndGenerateLink = async () => {
    try {
      // First save the form configuration
      await handleSaveFormConfiguration();

      // Then ensure we have a form ID
      const id = await ensureFormIdExists();
      if (id) {
        setIsLinkReady(true);
      }
    } catch (error) {
      console.error("Error saving form and generating link:", error);
      toast({
        title: "Error",
        description: "Failed to save form and generate link.",
        variant: "destructive"
      });
    }
  };
  return <Card className="mt-8 p-0 overflow-hidden py-[8px] my-[18px]">
      <CardContent className="p-0">
        <div className="p-6 border-b border-white bg-inherit pt-[18px] pb-0">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Share2 className="h-5 w-5" />
            <CardTitle className="text-lg text-brand-primary">Share Your Form</CardTitle>
          </div>
          <CardDescription className="text-brand-primary">
            Save your form configuration and share it with participants to collect stories.
          </CardDescription>
        </div>
        
        <div className="p-6">
          {isLinkReady ? <>
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800 flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Your form is ready to share! Use the links below.
                </AlertDescription>
              </Alert>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Public form link:</p>
                <div className="p-2 bg-gray-50 border rounded-md text-sm font-mono break-all">
                  {isGenerating ? <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating link...
                    </div> : `${getPublicFormBaseUrl()}/submit-story/${formId}`}
                </div>
              </div>
            </> : <Alert className="mb-4 bg-amber-50 border-amber-200">
              <AlertDescription className="text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Save your form configuration to generate a shareable link.
              </AlertDescription>
            </Alert>}
          
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap">
            <ShareFormSaveButton isSaving={isSaving || isGenerating} onClick={saveAndGenerateLink} />
            
            {isLinkReady && !isGenerating && <ShareFormLinkButtons copied={copied} onCopy={handleCopyLink} onOpenInNewTab={handleOpenInNewTab} onRevoke={handleRevokeLink} isRevoking={isRevoking} formId={formId || ""} />}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ShareFormSection;