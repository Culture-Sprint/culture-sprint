
import React from "react";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileWarning from "@/components/common/MobileWarning";
import { useLocation } from "react-router-dom";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  simplified?: boolean;
  allowMobile?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = "",
  simplified = false,
  allowMobile = false
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Check if the current route is a public form submission
  const isPublicFormRoute = location.pathname.includes('/submit-story');
  
  // Show mobile warning only if:
  // 1. It's a mobile device
  // 2. Not explicitly allowed via props
  // 3. Not a public form route
  const showMobileWarning = isMobile && !allowMobile && !isPublicFormRoute;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Show sidebar only if not in simplified mode */}
      {!simplified && <Sidebar />}
      
      {/* Main content area */}
      <main className={`flex-1 overflow-auto bg-brand-background p-6 ${className} ${simplified ? 'border-t-0' : 'border-t-4 border-brand-secondary'}`}>
        <div className="flex flex-col h-full">
          {showMobileWarning ? (
            <MobileWarning />
          ) : (
            <div className="flex-1">
              {children}
            </div>
          )}
          
          {/* Copyright footer */}
          <div className="text-center text-xs text-gray-400 py-4">
            ® Culture Sprint Platform
          </div>
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
