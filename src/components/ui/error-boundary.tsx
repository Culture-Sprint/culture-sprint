
import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorDisplay } from "@/components/ui/error-display";
import { logError } from "@/utils/errorLogging";

interface ErrorBoundaryProps {
  /** Child components to wrap with error boundary */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: ReactNode;
  /** Whether to show detailed error information */
  showDetails?: boolean;
  /** Component name for better error reporting */
  componentName?: string;
  /** Additional logging callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches errors in its children
 * and displays a fallback UI when errors occur
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to our centralized error logging system
    logError(error, `Error in ${this.props.componentName || 'component'}`, {
      componentName: this.props.componentName,
      category: 'ui',
      metadata: {
        componentStack: errorInfo.componentStack,
        reactPhase: 'render'
      },
      severity: 'error',
    });
    
    // Log the error to the console
    console.error(`Error in ${this.props.componentName || 'component'}:`, error);
    console.error("Component stack:", errorInfo.componentStack);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback or default fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4">
          <ErrorDisplay
            severity="error"
            title="Something went wrong"
            message={this.props.showDetails && this.state.error 
              ? this.state.error.message 
              : "There was a problem loading this section. Please try refreshing the page."}
            action={
              <button 
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              >
                Try again
              </button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap a component with an ErrorBoundary
 */
export function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  options: Omit<ErrorBoundaryProps, 'children'> = {}
) {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary {...options} componentName={displayName}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  return WrappedComponent;
}
