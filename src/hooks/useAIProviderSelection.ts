
import { useState } from 'react';
import { useAIProvider } from '@/contexts/AIProviderContext';
import { toast } from '@/components/ui/use-toast';

export const useAIProviderSelection = () => {
  const { provider, setProvider, isLoading, saveProviderPreference } = useAIProvider();
  const [saving, setSaving] = useState(false);

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider as 'openai' | 'perplexity');
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await saveProviderPreference();
      
      toast({
        title: "AI settings saved",
        description: `Your AI provider has been set to ${provider === 'openai' ? 'ChatGPT' : 'Perplexity AI'}.`,
      });
    } catch (error) {
      console.error('Error saving AI provider settings:', error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your AI settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    provider,
    isLoading: isLoading || saving,
    handleProviderChange,
    handleSaveSettings
  };
};
