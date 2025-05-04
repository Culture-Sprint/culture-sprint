
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIDebugInfo } from '@/hooks/slider-questions/sliderQuestionAIGenerator';

interface DebuggerTabsProps {
  debugInfo: AIDebugInfo | null;
}

const DebuggerTabs: React.FC<DebuggerTabsProps> = ({ debugInfo }) => {
  const [activeTab, setActiveTab] = useState('context');

  if (!debugInfo) return <div>No debug info available</div>;

  const formatContextSections = (context: string) => {
    if (!context) return <div>No context data available</div>;
    
    const sections = context.split('\n\n');
    
    return (
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="border-l-4 border-gray-200 pl-4 py-2">
            <pre className="whitespace-pre-wrap text-sm">{section}</pre>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-4 overflow-auto max-h-[60vh]">
      <Tabs defaultValue="context" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="context">Context</TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>
        
        <TabsContent value="context" className="mt-4 p-4 bg-gray-50 rounded-md overflow-auto max-h-[50vh]">
          <div className="text-xs text-gray-500 mb-2">
            {debugInfo.context ? `Context length: ${debugInfo.context.length} characters` : 'No context data'}
          </div>
          {formatContextSections(debugInfo.context || '')}
        </TabsContent>
        
        <TabsContent value="prompt" className="mt-4 p-4 bg-gray-50 rounded-md overflow-auto max-h-[50vh]">
          <pre className="whitespace-pre-wrap text-sm">{debugInfo.prompt || 'No prompt data'}</pre>
        </TabsContent>
        
        <TabsContent value="response" className="mt-4 p-4 bg-gray-50 rounded-md overflow-auto max-h-[50vh]">
          <pre className="whitespace-pre-wrap text-sm">{debugInfo.response || 'No response data'}</pre>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DebuggerTabs;
