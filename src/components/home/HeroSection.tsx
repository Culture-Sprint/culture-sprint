
import React from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section bg-gradient-to-b from-white to-accent/20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-6">
              Collect and explore stories that matter
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Culture Sprint helps communities and organizations work with stories 
              to gain insights, make decisions, and build connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/collect" className="flex items-center gap-2">
                  Start collecting stories
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/design" className="flex items-center gap-2">
                  View design steps
                  <ChevronRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="People collaborating on stories"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
