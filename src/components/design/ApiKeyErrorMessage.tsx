
import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiKeyErrorMessageProps {
  errorCode: string | null;
}

const ApiKeyErrorMessage: React.FC<ApiKeyErrorMessageProps> = ({ errorCode }) => {
  if (errorCode !== 'api_key_missing' && errorCode !== 'invalid_api_key') {
    return null;
  }

  const openSupabaseFunctions = () => {
    window.open('https://supabase.com/dashboard/project/vzxvkvabpbgxusskldtt/settings/functions', '_blank');
  };

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <p className="text-sm font-medium text-amber-800 mb-2">OpenAI API Key {errorCode === 'api_key_missing' ? 'Missing' : 'Invalid'}</p>
      <p className="text-sm text-amber-700 mb-3">
        To use the AI assistant, you need to add your OpenAI API key to the Supabase Edge Function secrets.
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 bg-amber-100 border-amber-200 text-amber-900 hover:bg-amber-200"
        onClick={openSupabaseFunctions}
      >
        <ExternalLink className="h-4 w-4" />
        Set API Key in Supabase
      </Button>
    </div>
  );
};

export default ApiKeyErrorMessage;
