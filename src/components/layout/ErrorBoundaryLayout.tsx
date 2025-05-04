
import React from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import PageLayout from "./PageLayout";
import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";

interface ErrorBoundaryLayoutProps {
  children: React.ReactNode;
  className?: string;
  simplified?: boolean;
  componentName?: string;
}

const ErrorBoundaryLayout: React.FC<ErrorBoundaryLayoutProps> = ({
  children,
  className,
  simplified,
  componentName = "Dashboard"
}) => {
  return (
    <ErrorBoundary
      fallback={<GlobalErrorBoundary.Fallback />}
      showDetails={process.env.NODE_ENV !== 'production'}
      componentName={componentName}
      onError={(error) => {
        console.error(`Error in ${componentName}:`, error);
      }}
    >
      <PageLayout className={className} simplified={simplified}>
        {children}
      </PageLayout>
    </ErrorBoundary>
  );
};

export default ErrorBoundaryLayout;
