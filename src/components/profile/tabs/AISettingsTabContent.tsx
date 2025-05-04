
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import AIProviderSelector from "../AIProviderSelector";
import { useUserRole } from "@/hooks/useUserRole";

interface AISettingsTabContentProps {
  aiProvider: string;
  onAIProviderChange: (provider: string) => void;
  loading: boolean;
  onAISettingsSubmit: () => Promise<void>;
}

const AISettingsTabContent: React.FC<AISettingsTabContentProps> = ({
  aiProvider,
  onAIProviderChange,
  loading,
  onAISettingsSubmit,
}) => {
  const { isDemo } = useUserRole();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAISettingsSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Provider Settings</CardTitle>
        <CardDescription>
          Choose which AI provider to use for generating content and responses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isDemo && (
          <Alert className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span>Upgrade your account to access additional AI providers and features.</span>
              <Button variant="outline" size="sm" asChild>
                <a href="/profile?tab=upgrade" className="flex items-center gap-2">
                  Upgrade Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <AIProviderSelector 
            value={aiProvider} 
            onChange={onAIProviderChange} 
            disabled={loading}
          />
          
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {aiProvider === 'openai' ? (
                "ChatGPT provides reliable AI responses with good overall performance."
              ) : (
                "Perplexity AI often provides more detailed and nuanced responses."
              )}
            </p>
          </div>

          <Button type="submit" disabled={loading || (isDemo && aiProvider !== 'openai')}>
            {loading ? "Saving..." : "Save AI Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AISettingsTabContent;
