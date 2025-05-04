
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AIPromptManager from "./AIPromptManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AIConfigSection = () => {
  return (
    <Card className="border border-primary/20">
      <CardHeader className="border-b bg-muted/10">
        <CardTitle className="text-xl text-primary">AI Configuration</CardTitle>
        <CardDescription>
          Manage AI prompts used throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="prompts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="prompts">Prompt Management</TabsTrigger>
            <TabsTrigger value="settings" disabled>Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompts">
            <AIPromptManager />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="text-muted-foreground italic">
              Advanced AI settings will be available in a future update
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIConfigSection;
