
import { BookOpen, Users, Layers, ArrowRight, ExternalLink, Clipboard, PenTool, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageLayout from "@/components/layout/PageLayout";

const About = () => {
  return (
    <PageLayout simplified={true}>
      <div className="container mx-auto py-12">
        {/* Hero section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-primary mb-6">About Culture Sprint Platform</h1>
          <p className="text-xl text-gray-600">
            The Culture Sprint Process helps you listen to your organization in a new way: through experiences. 
            Understand what's working, what's not, and why.
            <br />
            <strong className="text-[#E2005A]">The Platform support you to walk though the Culture Sprint process.</strong>
          </p>
        </div>
        
        {/* Info section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              What is Culture Sprint?
            </h2>
            <p className="text-gray-600 mb-4">
              Culture Sprint is a fresh take on workplace listening and culture 
              assessment, using anonymous employee stories to discover what's really 
              happening in your organization.
            </p>
            <p className="text-gray-600 mb-4">
              Unlike surveys that only tell you what is happening, experiences tell you why it's happening. 
              Our approach is particularly valuable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>Understanding the impact of organizational changes</li>
              <li>Identifying gaps between stated values and lived experiences</li>
              <li>Detecting emerging problems before they become crises</li>
              <li>Finding solutions that actually work for your people</li>
            </ul>
            <Button 
              variant="default" 
              className="bg-[#E2005A] hover:bg-[#E2005A]/90"
              onClick={() => window.open("https://culturesprint.co", "_blank")}
            >
              Learn More about Culture Sprint <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div>
            <img 
              src="/cs_unlock.png" 
              alt="People collaborating on culture insights" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
        
        {/* Three phases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            The Culture Sprint Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-2">
                  <BookOpen size={24} />
                </div>
                <CardTitle>Collect</CardTitle>
                <CardDescription>
                  Gather anonymous stories and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Employees share anonymous stories about their experiences. 
                  This creates a safe space for honest sharing about what's 
                  working and what's not.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-2">
                  <Layers size={24} />
                </div>
                <CardTitle>Understand</CardTitle>
                <CardDescription>
                  Make sense of patterns and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our platform turns individual stories into collective insights. 
                  See patterns emerge that point to strengths to build on and 
                  challenges that need addressing.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-2">
                  <Users size={24} />
                </div>
                <CardTitle>Act</CardTitle>
                <CardDescription>
                  Take meaningful action based on insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Turn insights into action with clear action plans. 
                  Create targeted solutions that address the real issues 
                  your people are experiencing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Resources */}
        <div className="bg-accent/20 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-primary mb-6">Get Started Using the Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">The platform will help you</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Clipboard className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Incorporate the important context to create your collection</span>
                </li>
                <li className="flex items-center gap-2">
                  <PenTool className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Build a collection form to be used for anonymous colection</span>
                </li>
                <li className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Create a dashboard and support pattern finding</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Start your Culture Sprint</h3>
              <p className="mb-4">
                Ready to hear what your people are really thinking? Start collecting 
                experiences and uncover insights that can transform your organization.
              </p>
              <Button asChild className="bg-[#E2005A] hover:bg-[#E2005A]/90">
                <Link to="/projects" className="inline-flex items-center gap-2">
                  Start Now
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
