
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CtaSection: React.FC = () => {
  return (
    <section className="section bg-accent/20">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Ready to start your story collection project?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join organizations and communities worldwide who use Culture Sprint to collect, 
            explore, and learn from stories that matter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/collect">Get started now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/design">Follow design steps</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
