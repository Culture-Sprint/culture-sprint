
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorAnalyticsData, getLoggedErrors, clearErrorStore, ErrorPriority } from "@/utils/errorLogging";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, Info, CheckCircle, RefreshCw, Trash2 } from "lucide-react";

// Helper function to get the appropriate icon for a severity level
function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'error':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

// Helper function to get CSS classes for priority badges
function getPriorityClasses(priority: ErrorPriority | string) {
  switch (priority) {
    case 'critical':
      return 'bg-red-500 hover:bg-red-600';
    case 'high':
      return 'bg-amber-500 hover:bg-amber-600';
    case 'medium':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'low':
      return 'bg-blue-500 hover:bg-blue-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
}

const ErrorMonitoringPanel = () => {
  const [errors, setErrors] = useState<ErrorAnalyticsData[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedError, setSelectedError] = useState<ErrorAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load errors on mount and whenever refreshed
  const loadErrors = () => {
    setIsLoading(true);
    try {
      // In a real implementation, this could be an API call to fetch errors
      const loggedErrors = getLoggedErrors();
      setErrors(loggedErrors);
    } catch (error) {
      console.error("Failed to load error logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadErrors();
  }, []);

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all error logs?")) {
      clearErrorStore();
      setErrors([]);
      setSelectedError(null);
    }
  };

  // Filter errors based on active tab
  const filteredErrors = errors.filter(error => {
    if (activeTab === 'all') return true;
    if (activeTab === 'critical') return error.metadata?.priority === 'critical';
    if (activeTab === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return error.timestamp >= today.getTime();
    }
    return error.category === activeTab;
  });

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Error Monitoring</CardTitle>
            <CardDescription>Track and analyze application errors</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadErrors}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClearLogs}
              disabled={errors.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear Logs
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Errors</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="ui">UI</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 border rounded-md">
              <div className="p-3 border-b bg-muted/50">
                <h3 className="text-sm font-medium">Error List</h3>
              </div>
              
              <ScrollArea className="h-[400px]">
                {filteredErrors.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No errors to display
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredErrors.map((error) => (
                      <div 
                        key={error.errorId}
                        className={`p-3 cursor-pointer hover:bg-muted/50 ${selectedError?.errorId === error.errorId ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedError(error)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getSeverityIcon(error.severity)}
                          <span className="font-medium truncate">{error.message}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{error.componentName || error.source}</span>
                          <span>{new Date(error.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="mt-1 flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {error.category}
                          </Badge>
                          {error.metadata?.priority && (
                            <Badge className={`text-xs text-white ${getPriorityClasses(error.metadata.priority as string)}`}>
                              {error.metadata.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <div className="col-span-1 md:col-span-2 border rounded-md">
              <div className="p-3 border-b bg-muted/50">
                <h3 className="text-sm font-medium">Error Details</h3>
              </div>
              
              {selectedError ? (
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="font-medium flex items-center gap-2">
                      {getSeverityIcon(selectedError.severity)}
                      {selectedError.message}
                    </h4>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedError.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium">Source</div>
                      <div className="text-sm">{selectedError.source}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Category</div>
                      <div className="text-sm">{selectedError.category}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Component</div>
                      <div className="text-sm">{selectedError.componentName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Priority</div>
                      <div className="text-sm">{selectedError.metadata?.priority || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {selectedError.stack && (
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-1">Stack Trace</div>
                      <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-[200px]">
                        {selectedError.stack}
                      </pre>
                    </div>
                  )}
                  
                  {selectedError.metadata && Object.keys(selectedError.metadata).length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Additional Information</div>
                      <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-[150px]">
                        {JSON.stringify(selectedError.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  Select an error to view details
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ErrorMonitoringPanel;
