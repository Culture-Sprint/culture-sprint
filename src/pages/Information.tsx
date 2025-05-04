
import React from "react";
import { Info, AlertTriangle, MessageSquare, BotIcon, ShieldAlert } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const Information = () => {
  return (
    <PageLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Info className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">Platform Information</h1>
          <p className="text-xl text-gray-600">
            Important details about the Culture Sprint platform
          </p>
        </div>
        
        {/* Beta Status Disclaimer */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-semibold">Beta Status Disclaimer</h2>
          </div>
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <AlertDescription className="text-gray-700">
              Please be aware that this application is currently in beta testing. As such, it is still under development and may contain bugs, instability, or unexpected behavior. We are actively working to improve the application, and your feedback is valuable to us. However, we cannot guarantee that the application will function as expected or that it will be free from errors. By using this application, you acknowledge that you are doing so at your own risk and that we are not liable for any damages or losses that may result from its use. Thank you for your participation in our beta program.
            </AlertDescription>
          </Alert>
        </section>
        
        {/* AI Usage Guidelines - Updated to match AI Assistant style */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BotIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">AI Usage Guidelines</h2>
          </div>
          <Card className="shadow-sm border border-[#7A0266] border-opacity-30">
            <CardContent className="p-0">
              <div className="bg-gradient-to-b from-white to-culturesprint-50/20 p-6">
                <p className="text-gray-700 mb-4">
                  The AI capabilities in Culture Sprint are designed to provide initial suggestions and guidance to support your process. While our AI tools can help streamline your work and provide valuable insights, we recommend that you:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Always review and edit AI-generated content before finalizing</li>
                  <li>Consider AI suggestions as starting points rather than final solutions</li>
                  <li>Apply your expertise and context-specific knowledge when evaluating AI recommendations</li>
                  <li>Use AI-generated questions and insights as inspiration for developing your own tailored approach</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Data Security Notice */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-6 w-6 text-destructive" />
            <h2 className="text-2xl font-semibold">Data Security Notice</h2>
          </div>
          <Card className="border-destructive/20">
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-4">
                Please be advised that while we take reasonable measures to protect your data, the Culture Sprint platform is still in development and has not undergone comprehensive security auditing or certification.
              </p>
              <p className="text-gray-700 font-medium">
                We strongly recommend against using this platform for projects involving:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                <li>Confidential or sensitive personal information</li>
                <li>Proprietary business data</li>
                <li>Information subject to regulatory compliance requirements</li>
                <li>Any data that would cause significant harm if compromised</li>
              </ul>
            </CardContent>
          </Card>
        </section>
        
        {/* Tooltips Information */}
        <section className="mb-10 bg-amber-100 p-6 rounded-lg border border-amber-200">
          <div className="flex items-start gap-3">
            <InfoTooltip
              contentKey="tooltip-demo"
              content="This is an example of a tooltip. Hover over icons like this throughout the app for helpful information."
              className="text-brand-primary mt-1"
              size={20}
            />
            <div>
              <h2 className="text-xl font-semibold mb-2">Tooltips Help</h2>
              <p className="text-gray-700">
                Throughout the Culture Sprint platform, you'll find tooltip icons like the one shown here. 
                Hover over or click on these icons to access helpful information about features and functionality. 
                These tooltips provide context-specific guidance to help you make the most of the platform.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Reminder */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Contact Support</h2>
          </div>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-gray-700">
                If you encounter any issues, have questions, or would like to provide feedback about the platform, 
                please don't hesitate to contact us. You can easily reach our support team by clicking on 
                the <strong>"Contact Us"</strong> option in the sidebar navigation.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
};

export default Information;
