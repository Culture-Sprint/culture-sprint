
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Bug } from "lucide-react";
import { getPublicForm } from "@/services/publicFormService";
import { formatQuestionsData } from "@/utils/publicFormDebug";
import { toast } from "@/components/ui/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

interface FormDataDebuggerProps {
  projectId?: string | null;
  formId?: string | null;
}

const FormDataDebugger: React.FC<FormDataDebuggerProps> = ({ projectId, formId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const { isSuperAdmin } = useUserRole();
  
  const refreshFormData = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project ID available to debug",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await getPublicForm(projectId);
      setDebugData({
        timestamp: new Date().toISOString(),
        projectId,
        formId,
        formData: data,
        formatted: formatQuestionsData(
          data?.storyQuestion,
          data?.sliderQuestions,
          data?.participantQuestions
        )
      });
      
      toast({
        title: "Debug Data Refreshed",
        description: `Found ${data?.sliderQuestions?.length || 0} slider questions and ${data?.participantQuestions?.length || 0} participant questions.`
      });
    } catch (error) {
      console.error("Error in debug refresh:", error);
      toast({
        title: "Debug Error",
        description: "Failed to load form data for debugging",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Don't show in production or if user is not a superadmin
  if (process.env.NODE_ENV === 'production' || !isSuperAdmin()) {
    return null;
  }
  
  return (
    <Card className="mb-6 border-yellow-300 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-yellow-800">
          <Bug className="w-4 h-4" />
          Form Data Debugger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="text-xs">
              <p><strong>Project ID:</strong> {projectId || 'Not available'}</p>
              <p><strong>Form ID:</strong> {formId || 'Not available'}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshFormData}
              disabled={isLoading || !projectId}
              className="h-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Refresh Form Data
                </>
              )}
            </Button>
          </div>
          
          {debugData && (
            <Tabs defaultValue="summary" className="mt-2">
              <TabsList className="grid w-full grid-cols-3 h-8">
                <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
                <TabsTrigger value="slider" className="text-xs">Slider Questions</TabsTrigger>
                <TabsTrigger value="participant" className="text-xs">Participant Questions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="pt-2">
                <div className="bg-white p-2 rounded border text-xs overflow-auto max-h-48">
                  <p><strong>Time:</strong> {debugData.timestamp}</p>
                  <p><strong>Story Question:</strong> {debugData.formatted.hasStoryQuestion ? 'Yes' : 'No'}</p>
                  <p><strong>Text:</strong> {debugData.formatted.storyQuestionPreview}</p>
                  <p><strong>Slider Questions:</strong> {debugData.formatted.sliderQuestionsCount}</p>
                  <p><strong>Participant Questions:</strong> {debugData.formatted.participantQuestionsCount}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="slider" className="pt-2">
                <div className="bg-white p-2 rounded border text-xs overflow-auto max-h-48">
                  {debugData.formData?.sliderQuestions && debugData.formData.sliderQuestions.length > 0 ? (
                    <div>
                      <p><strong>Count:</strong> {debugData.formData.sliderQuestions.length}</p>
                      <ul className="mt-1 space-y-1">
                        {debugData.formData.sliderQuestions.map((q: any, idx: number) => (
                          <li key={idx} className="border-b pb-1">
                            <strong>ID:</strong> {q.id}, <strong>Question:</strong> {q.question || 'None'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No slider questions found</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="participant" className="pt-2">
                <div className="bg-white p-2 rounded border text-xs overflow-auto max-h-48">
                  {debugData.formData?.participantQuestions && debugData.formData.participantQuestions.length > 0 ? (
                    <div>
                      <p><strong>Count:</strong> {debugData.formData.participantQuestions.length}</p>
                      <ul className="mt-1 space-y-1">
                        {debugData.formData.participantQuestions.map((q: any, idx: number) => (
                          <li key={idx} className="border-b pb-1">
                            <strong>ID:</strong> {q.id}, <strong>Label:</strong> {q.label || 'None'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No participant questions found</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormDataDebugger;
