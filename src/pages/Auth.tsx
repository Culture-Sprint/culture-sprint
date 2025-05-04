
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Import our components
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import AuthHeader from "@/components/auth/AuthHeader";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, signInWithLinkedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/projects");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (activeTab === "login") {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Error signing in",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success!",
            description: "You are now logged in.",
          });
          navigate("/projects");
        }
      } else {
        const userData = {
          full_name: fullName,
          username: username,
        };
        
        const { error } = await signUp(email, password, userData);
        
        if (error) {
          toast({
            title: "Error signing up",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success!",
            description: "Please check your email to confirm your account.",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Google Sign In Error",
        description: error.message || "An error occurred during Google sign in",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      setIsLinkedInLoading(true);
      await signInWithLinkedIn();
    } catch (error: any) {
      toast({
        title: "LinkedIn Sign In Error",
        description: error.message || "An error occurred during LinkedIn sign in",
        variant: "destructive",
      });
      setIsLinkedInLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-secondary p-4">
      <Card className="w-full max-w-md">
        <AuthHeader isLogin={activeTab === "login"} />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </div>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <TabsContent value="login" className="space-y-4">
                <LoginForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  isLoading={isLoading || isGoogleLoading || isLinkedInLoading}
                  onSubmit={handleSubmit}
                  onGoogleSignIn={handleGoogleSignIn}
                  onLinkedInSignIn={handleLinkedInSignIn}
                />
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <SignupForm 
                  fullName={fullName}
                  setFullName={setFullName}
                  username={username}
                  setUsername={setUsername}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  onGoogleSignIn={handleGoogleSignIn}
                  onLinkedInSignIn={handleLinkedInSignIn}
                />
              </TabsContent>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full flex items-center justify-center gap-2" 
                type="submit" 
                disabled={isLoading || isGoogleLoading || isLinkedInLoading}
              >
                {(isLoading || isGoogleLoading || isLinkedInLoading) && <Loader2 className="h-4 w-4 animate-spin" />}
                {activeTab === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
