
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import ENV from "@/config/env";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to the projects page
    if (user) {
      navigate("/projects");
    }
  }, [user, navigate]);

  return (
    <PageLayout simplified={!user} allowMobile={true}>
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome to Culture Sprint Platform
            {!ENV.IS_PRODUCTION && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 ml-2 rounded-full">DEV</span>}
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Your platform to guide you in running a Culture Sprint.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button asChild className="bg-[#E2005A] hover:bg-[#E2005A]/90">
              <Link to={user ? "/projects" : "/auth"}>Get Started</Link>
            </Button>
            <Button asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
