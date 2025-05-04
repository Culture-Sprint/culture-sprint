
import React, { useState } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, Send, ArrowLeft } from "lucide-react";
import { logError } from "@/utils/errorLogging";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/toast";

interface GlobalErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const GlobalErrorFallback: React.FC<GlobalErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleReset = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleReportError = () => {
    setReportDialogOpen(true);
  };

  const submitErrorReport = () => {
    if (error) {
      logError(error, "User reported critical error", {
        componentName: "Application",
        category: 'ui',
        severity: 'error',
        metadata: {
          userReport: true,
          userFeedback: additionalInfo,
          isCritical: true
        },
        report: true
      });
    }

    setReportDialogOpen(false);
    setAdditionalInfo("");
    toast({
      title: "Report Submitted",
      description: "Thank you for your feedback. We'll look into this issue.",
      variant: "success"
    });
  };

  const goToHomepage = () => {
    window.location.href = "/";
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="max-w-md w-full bg-background rounded-lg shadow-lg p-6 border">
        <div className="text-center">
          <div className="bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Application Error</h2>
          <p className="text-muted-foreground mb-4">Sorry, something went wrong. Please try one of the recovery options below.</p>
          
          {process.env.NODE_ENV !== 'production' && error && (
            <div className="bg-muted p-3 rounded-md mb-4 text-left overflow-auto max-h-40 text-xs">
              <p className="font-semibold mb-1">Error Details:</p>
              <pre className="whitespace-pre-wrap break-words">{error.message}</pre>
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-primary">Show stack trace</summary>
                  <pre className="mt-1 whitespace-pre-wrap break-words">{error.stack}</pre>
                </details>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button onClick={handleReset} className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload App
            </Button>
            
            <Button 
              variant="outline" 
              onClick={goBack} 
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={goToHomepage}
              className="flex items-center justify-center gap-2 col-span-2"
            >
              <Home className="h-4 w-4" />
              Go to Homepage
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleReportError} 
            className="flex items-center gap-2 mx-auto"
          >
            <Send className="h-4 w-4" />
            Report this Issue
          </Button>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>If this issue persists, please try clearing your browser cache or using a different browser.</p>
          </div>
        </div>
      </div>
      
      {/* Error Reporting Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Critical Error</DialogTitle>
            <DialogDescription>
              Help us improve by describing what happened before the application crashed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 p-3 bg-muted rounded-md">
              <p className="font-medium">Application Error</p>
              {error && <p className="text-sm mt-1">{error.message}</p>}
            </div>
            <Textarea
              placeholder="What were you trying to do when the application crashed? (optional)"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setReportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={submitErrorReport}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/**
 * Global error boundary for wrapping the entire application
 */
export const GlobalErrorBoundary = {
  Fallback: GlobalErrorFallback,
  Wrapper: ({ children }: { children: React.ReactNode }) => (
    <ErrorBoundary 
      fallback={<GlobalErrorFallback />}
      showDetails={process.env.NODE_ENV !== 'production'}
      componentName="Application"
      onError={(error) => {
        // Log to centralized error logging system
        logError(error, "Global application error", {
          componentName: "Application",
          category: 'ui',
          severity: 'error',
          metadata: {
            isCritical: true,
            appLevel: true
          },
          report: true
        });
      }}
    >
      {children}
    </ErrorBoundary>
  )
};

export default GlobalErrorBoundary;
