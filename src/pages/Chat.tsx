import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import ChatGpt from "@/components/chat/ChatGpt";
import { InfoTooltip } from "@/components/ui/info-tooltip";
const Chat = () => {
  return <PageLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-6">
          <Card className="shadow-md border border-[#7A0266] border-opacity-30">
            <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
              <div className="flex items-center gap-2">
                <CardTitle className="flex items-center gap-2 text-primary text-4xl">
                  <Sparkles className="h-5 w-5 text-primary opacity-80" />
                  AI Assistant
                </CardTitle>
                <InfoTooltip contentKey="ai-assistant" size={16} />
              </div>
              <CardDescription className="font-medium">
                Ask questions about Culture Sprint
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-4 bg-gradient-to-b from-white to-culturesprint-50/20 rounded-b-md">
              <div className="flex justify-center">
                <ChatGpt title="AI Assistant" autoScroll={true} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>;
};
export default Chat;