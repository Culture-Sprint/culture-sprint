
import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useUpgradeStatus } from "@/hooks/useUpgradeStatus";
import { useUserRole } from "@/hooks/useUserRole";

interface RedeemCodeResponse {
  success: boolean;
  message: string;
  expires_at?: string;
}

const CodeRedemptionTabContent = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { expirationDate, loading: statusLoading, setExpirationDate } = useUpgradeStatus();
  const { isDemo } = useUserRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('redeem_upgrade_code', { code_text: code });

      if (error) throw error;

      // Safe type checking for the response
      if (typeof data === 'object' && data !== null) {
        // First cast to unknown, then to our type
        const response = data as unknown as RedeemCodeResponse;
        
        if ('success' in response && typeof response.success === 'boolean') {
          if (response.success) {
            toast({
              title: "Success",
              description: response.message,
            });
            if (response.expires_at) {
              setExpirationDate(response.expires_at);
            }
            setCode("");
          } else {
            toast({
              title: "Error",
              description: response.message,
              variant: "destructive",
            });
          }
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to redeem code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (statusLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (expirationDate && !isDemo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Your account has been upgraded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              Your user access will expire on:{" "}
              <span className="font-medium">
                {format(new Date(expirationDate), "PPP")}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isDemo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Account</CardTitle>
          <CardDescription>
            Enter your upgrade code to activate full user features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your upgrade code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !code}>
              {loading ? "Redeeming..." : "Redeem Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Status</CardTitle>
        <CardDescription>
          Your account is active
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You are currently using a standard user account.
        </p>
      </CardContent>
    </Card>
  );
};

export default CodeRedemptionTabContent;
