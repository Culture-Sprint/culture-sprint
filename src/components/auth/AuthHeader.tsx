
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AuthHeaderProps {
  isLogin: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isLogin }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-6 pb-2">
        <div className="w-16 h-16 mb-2 flex items-center justify-center">
          <img 
            src="/cs_logo.png" 
            alt="Culture Sprint Logo" 
            className="w-full h-full object-contain" 
          />
        </div>
        <h1 className="text-3xl font-bold text-brand-primary">Culture Sprint Platform</h1>
      </div>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          {isLogin ? "Sign in to your account" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? "Enter your email below to sign in to your account"
            : "Enter your information to create a new account"}
        </CardDescription>
      </CardHeader>
    </>
  );
};

export default AuthHeader;
