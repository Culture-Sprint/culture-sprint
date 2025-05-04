
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { simulateError, SimulatedErrorType, ErrorSimulationOptions } from "@/utils/errorSimulation";
import useFeedback from "@/hooks/useFeedback";
import { useErrorHandler } from "@/utils/errorHandling";
import { ErrorDisplay } from "@/components/ui/error-display";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const ErrorTestingPanel: React.FC = () => {
  const [errorType, setErrorType] = useState<SimulatedErrorType>(SimulatedErrorType.Network);
  const [errorMessage, setErrorMessage] = useState("Simulated error for testing");
  const [errorCode, setErrorCode] = useState("TEST_ERROR");
  const [showInBoundary, setShowInBoundary] = useState(false);
  const [isRecoverable, setIsRecoverable] = useState(true);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState("simulate");
  
  // Error handling utilities
  const { showError, showSuccess, withFeedback } = useFeedback("ErrorTestingPanel");
  const { handleError } = useErrorHandler("ErrorTestingPanel");
  
  /**
   * Handle testing an error with direct simulation
   */
  const handleTestError = async () => {
    setTestResult(null);
    setLastError(null);
    
    const options: ErrorSimulationOptions = {
      message: errorMessage,
      code: errorCode,
      recoverable: isRecoverable
    };
    
    try {
      // If we're testing unhandled error in a boundary, we need to throw directly
      if (errorType === SimulatedErrorType.Unhandled && !showInBoundary) {
        simulateError(errorType, options);
        // We shouldn't reach this point with unhandled errors
        setTestResult({ 
          success: false, 
          message: "Error was not properly thrown" 
        });
      } else {
        // For all other error types, use Promise rejection pattern
        await simulateError(errorType, options);
        // We shouldn't reach this point normally
        setTestResult({ 
          success: false, 
          message: "Error was not thrown as expected" 
        });
      }
    } catch (error) {
      // For testing purposes, we want to catch the error to show it was thrown
      setLastError(error instanceof Error ? error : new Error(String(error)));
      setTestResult({ 
        success: true, 
        message: "Error was successfully thrown" 
      });
      
      // Only show error feedback if not testing in boundary
      if (!showInBoundary) {
        showError(error, `Simulated ${errorType} error`, {
          suggestions: isRecoverable ? ["This is a recoverable error", "Try again"] : undefined,
          recoveryAction: isRecoverable ? () => {
            showSuccess("Recovery action executed", {
              duration: 3000
            });
          } : undefined,
          recoveryActionText: isRecoverable ? "Recover" : undefined
        });
      }
    }
  };
  
  /**
   * Test error with the withFeedback wrapper
   */
  const testWithFeedbackWrapper = withFeedback(
    async () => {
      // Simulate an error for the withFeedback wrapper to handle
      await simulateError(errorType, {
        message: errorMessage,
        code: errorCode
      });
      return true; // This won't execute if the error is thrown
    },
    {
      loadingMessage: "Testing error handling...",
      errorMessage: `Error handling test (${errorType})`,
      successMessage: "This shouldn't show since we're simulating an error",
      showLoadingState: true
    }
  );
  
  /**
   * Component for showing error boundary tests
   */
  const ErrorBoundaryTest = () => {
    // This will throw during render when the button is clicked
    if (lastError && showInBoundary) {
      throw lastError;
    }
    
    return (
      <div className="p-4 border rounded-md bg-muted/10">
        <p className="text-sm mb-4">Click "Test Error" to throw an error inside this boundary.</p>
        {testResult && testResult.success && showInBoundary && (
          <Alert className={`mb-4 ${lastError ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <AlertTitle>Error Boundary Test</AlertTitle>
            <AlertDescription>
              {lastError 
                ? "Error thrown. The boundary should have caught it." 
                : "No error was thrown."}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Error Testing Panel</CardTitle>
        <CardDescription>
          Test error handling and recovery paths in the application
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="simulate" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="simulate">Simulate Errors</TabsTrigger>
            <TabsTrigger value="boundary">Test Error Boundaries</TabsTrigger>
            <TabsTrigger value="feedback">Test Feedback Wrapper</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="error-type">Error Type</Label>
                <Select 
                  value={errorType} 
                  onValueChange={(value) => setErrorType(value as SimulatedErrorType)}
                >
                  <SelectTrigger id="error-type">
                    <SelectValue placeholder="Select error type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(SimulatedErrorType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)} Error
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="error-code">Error Code</Label>
                <Input
                  id="error-code"
                  value={errorCode}
                  onChange={(e) => setErrorCode(e.target.value)}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="error-message">Error Message</Label>
                <Input
                  id="error-message"
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="recoverable"
                  checked={isRecoverable}
                  onCheckedChange={setIsRecoverable}
                />
                <Label htmlFor="recoverable">Recoverable Error</Label>
              </div>
              
              {activeTab === "boundary" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-in-boundary"
                    checked={showInBoundary}
                    onCheckedChange={setShowInBoundary}
                  />
                  <Label htmlFor="show-in-boundary">Throw Inside Boundary</Label>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={activeTab === "feedback" ? testWithFeedbackWrapper : handleTestError}
                variant="default"
              >
                Test Error
              </Button>
            </div>
            
            {/* Test Results */}
            {testResult && (
              <Alert className={testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                <div className="flex items-center gap-2">
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <AlertTitle>Test Result</AlertTitle>
                </div>
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}
            
            {/* Error Boundary Test */}
            {activeTab === "boundary" && (
              <ErrorBoundary 
                fallback={
                  <div className="p-4 border rounded-md bg-red-50">
                    <h3 className="text-lg font-medium text-red-800 mb-2">Error Boundary Triggered</h3>
                    <p className="text-red-700 mb-3">
                      The error boundary successfully caught an error.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setLastError(null);
                        setTestResult(null);
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset Test
                    </Button>
                  </div>
                }
              >
                <ErrorBoundaryTest />
              </ErrorBoundary>
            )}
            
            {/* Last Error Details */}
            {lastError && !showInBoundary && (
              <div className="mt-4">
                <Label className="mb-2 block">Last Error Details</Label>
                <ErrorDisplay 
                  message={lastError.message}
                  code={errorCode}
                  severity="error"
                  error={lastError}
                  componentName="ErrorTestingPanel"
                />
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ErrorTestingPanel;
