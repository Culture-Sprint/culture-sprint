
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DebugPanelProps {
  formId?: string | null;
  projectId?: string | null;
  resolvedProjectId?: string | null;
  storyQuestion?: string | null;
  sliderQuestions?: any[];
  participantQuestions?: any[];
  isLoading?: boolean;
  error?: string | null;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
  formId,
  projectId,
  resolvedProjectId,
  storyQuestion,
  sliderQuestions = [],
  participantQuestions = [],
  isLoading,
  error
}) => {
  return (
    <div className="mt-2 mb-4 bg-yellow-50 p-4 rounded border border-yellow-300 text-xs overflow-auto max-h-[300px]">
      <h3 className="font-bold mb-2">Public Form Debug Information</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p><strong>Form ID:</strong> {formId || 'Not provided'}</p>
          <p><strong>Project ID:</strong> {projectId || 'Not provided'}</p>
          <p><strong>Resolved Project ID:</strong> {resolvedProjectId || 'None'}</p>
          <p><strong>Story Question:</strong> {storyQuestion || 'None'}</p>
        </div>
        <div>
          <p><strong>Slider Questions:</strong> {sliderQuestions?.length || 0}</p>
          <p><strong>Participant Questions:</strong> {participantQuestions?.length || 0}</p>
          <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
        </div>
      </div>
      
      {(!sliderQuestions || sliderQuestions.length === 0) && 
       (!participantQuestions || participantQuestions.length === 0) && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Form Elements</AlertTitle>
          <AlertDescription>
            No slider or participant questions were loaded. This could indicate a synchronization issue
            or that the form hasn't been fully configured yet.
          </AlertDescription>
        </Alert>
      )}
      
      {sliderQuestions && sliderQuestions.length > 0 && (
        <div className="mt-2">
          <h4 className="font-semibold">Slider Questions:</h4>
          <ul className="list-disc pl-5">
            {sliderQuestions.map((q, idx) => (
              <li key={idx}>{q.question?.substring(0, 40) || 'No question text'} (ID: {q.id})</li>
            ))}
          </ul>
        </div>
      )}
      
      {participantQuestions && participantQuestions.length > 0 && (
        <div className="mt-2">
          <h4 className="font-semibold">Participant Questions:</h4>
          <ul className="list-disc pl-5">
            {participantQuestions.map((q, idx) => (
              <li key={idx}>{q.label?.substring(0, 40) || 'No label'} (ID: {q.id})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
