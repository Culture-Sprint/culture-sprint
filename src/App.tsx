
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { AIProviderProvider } from "@/contexts/AIProviderContext";
import { Toaster } from "@/components/ui/toaster";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Projects from "@/pages/Projects";
import Design from "@/pages/Design";
import Collect from "@/pages/Collect";
import Explore from "@/pages/Explore";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserProfile from "./pages/UserProfile";
import Admin from "./pages/Admin";
import PublicSubmission from "./pages/PublicSubmission";
import PublicDashboard from "./pages/PublicDashboard";
import Information from "./pages/Information";
import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import { setupGlobalErrorListeners, monitorPerformance } from "@/utils/errorMonitoring";
import { toast } from "@/hooks/toast";
import { envValidation } from '@/config/env';
import { EnvValidationError, createEnvValidationError } from '@/types/errors';
import { EnvErrorDisplay } from '@/components/ui/env-error-display';

function App() {
  const [envError, setEnvError] = useState<EnvValidationError | null>(null);

  useEffect(() => {
    // Check for environment configuration errors
    if (!envValidation.isValid) {
      setEnvError(createEnvValidationError(envValidation.missingVars));
      console.error('Environment validation failed:', envValidation.message);
    }
  }, []);

  // Show error if environment validation failed
  if (envError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="max-w-lg w-full">
          <EnvErrorDisplay error={envError} />
        </div>
      </div>
    );
  }

  // Initialize global error listeners
  useEffect(() => {
    const cleanup = setupGlobalErrorListeners();
    
    // Measure initial app performance
    monitorPerformance(() => {
      // Performance measurement for initial app load
      return true;
    }, "App initialization", 2000);
    
    // Show welcome toast on first render in development
    if (process.env.NODE_ENV !== 'production') {
      toast({
        title: "Application Ready",
        description: "Error monitoring and feedback systems are active.",
        variant: "info",
      });
    }
    
    return () => {
      // Clean up global listeners when App unmounts
      cleanup();
    };
  }, []);

  return (
    <GlobalErrorBoundary.Wrapper>
      <Router>
        <AuthProvider>
          <ProjectProvider>
            <AIProviderProvider>
              <Toaster />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/submit-story/:formId" element={<PublicSubmission />} />
                <Route path="/public-dashboard/:token" element={<PublicDashboard />} />
                
                {/* Protected routes using Outlet pattern */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/design" element={<Design />} />
                  <Route path="/collect" element={<Collect />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/information" element={<Information />} />
                  <Route path="/admin" element={<Admin />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AIProviderProvider>
          </ProjectProvider>
        </AuthProvider>
      </Router>
    </GlobalErrorBoundary.Wrapper>
  );
}

export default App;
