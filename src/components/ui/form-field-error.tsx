
import React from 'react';
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldErrorProps {
  message: string | null | undefined;
  className?: string;
}

export const FormFieldError: React.FC<FormFieldErrorProps> = ({ 
  message, 
  className 
}) => {
  if (!message) return null;
  
  return (
    <div className={cn(
      "flex items-start gap-1.5 mt-1.5 text-sm text-destructive", 
      className
    )}>
      <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};
