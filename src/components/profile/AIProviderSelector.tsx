
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Zap } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

interface AIProviderSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const { isDemo } = useUserRole();
  
  // Force ChatGPT as the provider for demo users
  useEffect(() => {
    if (isDemo && value !== 'openai') {
      onChange('openai');
    }
  }, [isDemo, value, onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="ai-provider">AI Provider</Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || isDemo}
      >
        <SelectTrigger id="ai-provider" className="w-full">
          <SelectValue placeholder="Select AI Provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="openai" className="flex items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>ChatGPT (Default)</span>
            </div>
          </SelectItem>
          <SelectItem value="perplexity" className="flex items-center" disabled={isDemo}>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Perplexity AI</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {isDemo ? (
          "Demo users can only use the default ChatGPT provider. Upgrade your account to access Perplexity AI."
        ) : (
          "Select which AI provider to use when generating content and responses."
        )}
      </p>
    </div>
  );
};

export default AIProviderSelector;
