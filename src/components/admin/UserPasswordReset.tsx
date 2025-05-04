
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, KeyRound } from "lucide-react";

interface UserPasswordResetProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
}

const UserPasswordReset: React.FC<UserPasswordResetProps> = ({
  userId,
  userEmail,
  onClose
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset state
    setError(null);
    
    // Validate passwords
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      setIsResetting(true);
      
      // Call the Supabase Admin API to reset the user's password
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      );
      
      if (error) throw error;
      
      toast({
        title: "Password reset successful",
        description: `Password has been reset for ${userEmail}`,
      });
      
      // Close the form
      onClose();
      
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to reset password");
      
      toast({
        title: "Password reset failed",
        description: err.message || "An error occurred while resetting the password",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Reset Password
        </CardTitle>
        <CardDescription>
          Reset password for user: {userEmail}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handlePasswordReset}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isResetting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isResetting}
          >
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserPasswordReset;
