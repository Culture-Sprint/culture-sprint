
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          toast({
            title: "Successfully authenticated",
            description: "You have been signed in with Google.",
          });
          
          navigate("/projects");
        } else {
          navigate("/auth");
        }
      } catch (error: any) {
        console.error("Error in auth callback:", error);
        toast({
          title: "Authentication Error",
          description: error.message || "An error occurred during the authentication process",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we confirm your identity.</p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
