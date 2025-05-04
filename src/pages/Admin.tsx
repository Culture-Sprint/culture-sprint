
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import AdminContainer from "@/components/admin/AdminContainer";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import PerplexityTest from "@/components/perplexity/PerplexityTest";
import CodeManagement from "@/components/admin/CodeManagement";
import AIConfigSection from "@/components/admin/AIConfigSection";
import ENV from "@/config/env";

const Admin = () => {
  const { isSuperAdmin, loading } = useUserRole();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !isSuperAdmin()) {
      navigate("/projects");
    }
  }, [isSuperAdmin, loading, navigate]);

  if (loading) {
    return (
      <PageLayout>
        <div className="p-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-8 bg-muted rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <PageLayout>
        <div className="p-8">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        <AdminContainer />
        
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <AIConfigSection />
          
          <CodeManagement />
          
          <div className="bg-white border rounded-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Perplexity API Test</h2>
            <PerplexityTest />
          </div>
          
          <div className="bg-white border rounded-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Environment Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Environment:</strong> {ENV.NODE_ENV}</p>
              <p><strong>Supabase Project:</strong> {ENV.SUPABASE_URL.split('.')[0].split('//')[1]}</p>
              <p><strong>Debug Mode:</strong> {ENV.ENABLE_DEBUG ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Admin;
