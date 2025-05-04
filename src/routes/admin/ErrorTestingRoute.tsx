
import React from 'react';
import ErrorTestingPanel from '@/components/admin/ErrorTestingPanel';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Admin route for testing error handling scenarios
 */
const ErrorTestingRoute: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Error Testing Dashboard</h1>
        <p className="text-muted-foreground">
          Test error handling, recovery paths, and boundary functionality
        </p>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="manual" className="w-full">
        <TabsList>
          <TabsTrigger value="manual">Manual Testing</TabsTrigger>
          <TabsTrigger value="automated">Automated Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="mt-4">
          <ErrorTestingPanel />
        </TabsContent>
        
        <TabsContent value="automated" className="mt-4">
          <div className="bg-muted/20 border rounded-lg p-6 text-center">
            <h3 className="text-xl font-medium mb-2">Automated Error Tests</h3>
            <p className="mb-4 text-muted-foreground">
              Automated error testing is available through the test runner.
              Check the console for test results or run Jest tests separately.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ErrorTestingRoute;
