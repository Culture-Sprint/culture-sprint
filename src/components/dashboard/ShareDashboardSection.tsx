
import React, { useState, useEffect } from "react";
import { Copy, Link2, Shield, Trash2, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createDashboardToken, getProjectDashboardTokens, revokeDashboardToken, DashboardToken } from "@/services/dashboardTokenService";
import { formatDistanceToNow } from "date-fns";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import EmbedCodeDialog from "@/components/common/EmbedCodeDialog";
import { generateDashboardEmbedCode } from "@/utils/embedCodeUtils";

interface ShareDashboardSectionProps {
  projectId: string;
  projectName: string;
}

const ShareDashboardSection: React.FC<ShareDashboardSectionProps> = ({ projectId, projectName }) => {
  const [tokens, setTokens] = useState<DashboardToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Fetch existing tokens
  const fetchTokens = async () => {
    setIsLoading(true);
    const fetchedTokens = await getProjectDashboardTokens(projectId);
    setTokens(fetchedTokens);
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (projectId) {
      fetchTokens();
    }
  }, [projectId]);
  
  // Create a new token
  const handleCreateToken = async () => {
    setIsCreating(true);
    const newToken = await createDashboardToken(projectId);
    if (newToken) {
      setTokens(prev => [newToken, ...prev]);
      toast({
        title: "Public link created",
        description: "You can now share your dashboard with others using this link"
      });
    } else {
      toast({
        title: "Failed to create public link",
        description: "An error occurred while creating the link",
        variant: "destructive"
      });
    }
    setIsCreating(false);
  };
  
  // Revoke a token
  const handleRevokeToken = async (tokenId: string) => {
    const success = await revokeDashboardToken(tokenId);
    if (success) {
      setTokens(prev => prev.filter(token => token.id !== tokenId));
      toast({
        title: "Public link revoked",
        description: "The link is no longer accessible"
      });
    } else {
      toast({
        title: "Failed to revoke link",
        description: "An error occurred while revoking the link",
        variant: "destructive"
      });
    }
  };
  
  // Copy link to clipboard
  const copyLinkToClipboard = (token: string) => {
    const url = `${window.location.origin}/public-dashboard/${token}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with others"
    });
  };
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Share Dashboard Publicly
          </CardTitle>
          <InfoTooltip contentKey="dashboard-share-publicly" size={16} />
        </div>
        <CardDescription>
          Create public links to share your dashboard with non-registered users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Anyone with the link can view this project's dashboard without logging in.
              Revoke links at any time to prevent access.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleCreateToken}
            disabled={isCreating}
            className="mb-4"
          >
            {isCreating ? "Creating..." : "Create Public Link"}
          </Button>
          
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : tokens.length === 0 ? (
            <div className="text-sm text-muted-foreground">No public links have been created yet</div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Active Public Links</h3>
              {tokens.map(token => (
                <div key={token.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <div className="font-medium truncate max-w-xs">
                      {`${window.location.origin}/public-dashboard/${token.token}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(token.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyLinkToClipboard(token.token)}
                      title="Copy link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <EmbedCodeDialog
                      code={generateDashboardEmbedCode(token.token)}
                      title="Embed Dashboard"
                      description="Copy this code to embed the dashboard on your website."
                      trigger={
                        <Button 
                          variant="outline" 
                          size="sm"
                          title="Get embed code"
                        >
                          <Code className="h-4 w-4" />
                        </Button>
                      }
                    />
                    
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleRevokeToken(token.id)}
                      title="Revoke link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareDashboardSection;
