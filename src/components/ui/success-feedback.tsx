
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface SuccessFeedbackProps {
  title?: string;
  message: string;
  className?: string;
  duration?: number;
  onClose?: () => void;
  action?: React.ReactNode;
}

export const SuccessFeedback: React.FC<SuccessFeedbackProps> = ({
  title = "Success",
  message,
  className,
  duration,
  onClose,
  action
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <Alert 
      className={cn(
        "border-green-200 bg-green-50 text-green-800",
        className
      )}
    >
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
      
      {action && (
        <div className="mt-3">
          {action}
        </div>
      )}
    </Alert>
  );
};
