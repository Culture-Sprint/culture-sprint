
import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "@/components/ui/error-display";

interface ApiKeyErrorProps {
  errorCode: string | null;
}

/**
 * Specialized error component for handling API key errors
 */
export function ApiKeyError({ errorCode }: ApiKeyErrorProps) {
  if (errorCode !== 'api_key_missing' && errorCode !== 'invalid_api_key') {
    return null;
  }

  const openSupabaseFunctions = () => {
    window.open('https://supabase.com/dashboard/project/vzxvkvabpbgxusskldtt/settings/functions', '_blank');
  };

  return (
    <ErrorDisplay
      severity="warning"
      title={`OpenAI API Key ${errorCode === 'api_key_missing' ? 'Missing' : 'Invalid'}`}
      message="To use the AI assistant, you need to add your OpenAI API key to the Supabase Edge Function secrets."
      action={
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 bg-amber-100 border-amber-200 text-amber-900 hover:bg-amber-200"
          onClick={openSupabaseFunctions}
        >
          <ExternalLink className="h-4 w-4" />
          Set API Key in Supabase
        </Button>
      }
    />
  );
}
