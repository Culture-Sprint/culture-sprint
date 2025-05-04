
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const DesignCTA: React.FC = () => {
  return (
    <div className="bg-accent/20 p-8 rounded-lg mb-16">
      <h2 className="text-3xl font-bold text-primary mb-4">Ready to start your PNI journey?</h2>
      <p className="text-lg text-gray-600 mb-6">
        Follow these design steps to create a comprehensive narrative inquiry project
        that will help your community or organization learn from its stories.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link to="/collect" className="flex items-center gap-2">
            Start collecting stories
            <ChevronRight size={16} />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/about" className="flex items-center gap-2">
            Learn more about PNI
            <ChevronRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DesignCTA;
