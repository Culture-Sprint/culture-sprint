
import React, { useState } from "react";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface UserRolesProps {
  user: User;
  onRoleChange?: (role: string) => void;
  disabled?: boolean;
}

export const UserRoles: React.FC<UserRolesProps> = ({ 
  user, 
  onRoleChange,
  disabled = false 
}) => {
  const availableRoles = ["user", "admin", "superuser", "superadmin", "demo"] as const;
  type AppRole = typeof availableRoles[number];
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<AppRole>(getHighestRole(user.roles || ["user"]));
  
  // Get the highest role (with priority)
  function getHighestRole(roles: string[]): AppRole {
    if (roles.includes("superadmin")) return "superadmin";
    if (roles.includes("superuser")) return "superuser";
    if (roles.includes("admin")) return "admin";
    if (roles.includes("demo")) return "demo";
    return "user";
  }
  
  const handleRoleChange = async (role: AppRole) => {
    setIsLoading(true);
    try {
      // Remove all existing roles for the user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);
      
      if (deleteError) throw deleteError;
      
      // Add the new role - use type assertion to handle the enum mismatch
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: role as any // Type assertion to bypass the TypeScript error
        });
      
      if (insertError) throw insertError;
      
      // Update local state to reflect the change
      setCurrentUserRole(role);
      
      if (onRoleChange) {
        onRoleChange(role);
        toast({
          title: "Role updated",
          description: `User role has been updated to ${role}`,
        });
      }
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error updating role",
        description: error.message || "An error occurred while updating the role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {user.roles?.map((role) => (
          <Badge key={role} variant="outline" className="capitalize">
            {role}
          </Badge>
        ))}
      </div>
      
      <Select
        value={currentUserRole}
        onValueChange={handleRoleChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select role">
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </span>
            ) : (
              currentUserRole
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((role) => (
            <SelectItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserRoles;
