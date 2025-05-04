
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStorageItem, setStorageItem } from '@/services/utils/storageUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

type AIProvider = 'openai' | 'perplexity';

interface AIProviderContextType {
  provider: AIProvider;
  setProvider: (provider: AIProvider) => void;
  isLoading: boolean;
  saveProviderPreference: () => Promise<void>;
}

const AIProviderContext = createContext<AIProviderContextType | undefined>(undefined);

export const AIProviderProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { isDemo } = useUserRole();
  const [provider, setProvider] = useState<AIProvider>(() => {
    const savedProvider = getStorageItem('culturesprint_ai_provider', 'openai') as AIProvider;
    return isDemo ? 'openai' : savedProvider;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const syncProviderWithProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('ai_provider')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching AI provider preference:', error);
          return;
        }
        
        if (data?.ai_provider) {
          const profileProvider = data.ai_provider as AIProvider;
          if (!isDemo || profileProvider === 'openai') {
            setProvider(profileProvider);
            setStorageItem('culturesprint_ai_provider', profileProvider);
          }
        }
      } catch (error) {
        console.error('Unexpected error syncing AI provider:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    syncProviderWithProfile();
  }, [user, isDemo]);

  const saveProviderPreference = async () => {
    if (isDemo && provider !== 'openai') {
      return;
    }
    
    setStorageItem('culturesprint_ai_provider', provider);
    
    if (user) {
      try {
        setIsLoading(true);
        const { error } = await supabase
          .from('profiles')
          .update({ ai_provider: provider })
          .eq('id', user.id);
        
        if (error) {
          console.error('Error saving AI provider preference:', error);
        }
      } catch (error) {
        console.error('Unexpected error saving AI provider:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AIProviderContext.Provider 
      value={{ 
        provider, 
        setProvider: (newProvider) => {
          if (isDemo && newProvider !== 'openai') return;
          setProvider(newProvider);
        }, 
        isLoading,
        saveProviderPreference
      }}
    >
      {children}
    </AIProviderContext.Provider>
  );
};

export const useAIProvider = (): AIProviderContextType => {
  const context = useContext(AIProviderContext);
  if (context === undefined) {
    throw new Error('useAIProvider must be used within an AIProviderProvider');
  }
  return context;
};
