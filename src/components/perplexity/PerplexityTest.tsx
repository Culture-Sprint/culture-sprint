
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import ENV from '@/config/env';

const PerplexityTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('perplexity-test');
      
      if (error) throw error;
      
      setResult(data);
      setEnvStatus('API connection successful');
      toast({
        title: "Success",
        description: "Successfully connected to Perplexity API",
      });
    } catch (error: any) {
      console.error('Error testing Perplexity connection:', error);
      setEnvStatus(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: error.message || "Failed to test Perplexity connection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          onClick={testConnection}
          disabled={loading}
        >
          {loading ? "Testing..." : "Test Perplexity Connection"}
        </Button>
        
        {ENV.ENABLE_DEBUG && (
          <div className="text-xs bg-gray-100 px-3 py-1 rounded">
            Environment: {ENV.NODE_ENV}
          </div>
        )}
      </div>
      
      {envStatus && (
        <div className={`text-sm p-2 rounded ${envStatus.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {envStatus}
        </div>
      )}
      
      {result && (
        <pre className="p-4 bg-gray-100 rounded-lg overflow-auto text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default PerplexityTest;
