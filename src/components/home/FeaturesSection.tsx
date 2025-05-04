
import React from "react";
import FeatureCard from "./FeatureCard";
import { BookOpen, Layers, Users } from "lucide-react";

const FeaturesSection: React.FC = () => {
  return (
    <section className="section bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Participatory Narrative Inquiry
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Culture Sprint supports the three phases of participatory narrative inquiry: 
            collection, catalysis, and return.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<BookOpen size={24} />}
            title="Collect Stories"
            description="Create custom story collection forms and gather narratives from your community through interviews or self-directed participation."
            linkText="Start collecting"
            linkUrl="/collect"
          />
          
          <FeatureCard 
            icon={<Layers size={24} />}
            title="Explore Patterns"
            description="Analyze your stories to find patterns and insights. Create visualizations and reports to help make sense of the collected narratives."
            linkText="Explore stories"
            linkUrl="/explore"
          />
          
          <FeatureCard 
            icon={<Users size={24} />}
            title="Catalyze Change"
            description="Use the insights from your stories to create positive change in your community or organization through deliberate intervention."
            linkText="View dashboard"
            linkUrl="/dashboard"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
