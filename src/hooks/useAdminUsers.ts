
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { toast } from "@/components/ui/use-toast";

interface RoleResponse {
  role_name: string;
}

interface UserEmailResponse {
  id: string;
  email: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles data directly
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
      
      if (profilesError) throw profilesError;

      // Get real user emails from the secure function
      const { data: userEmails, error: emailsError } = await supabase
        .rpc("get_user_emails");

      if (emailsError) {
        console.error("Error fetching user emails:", emailsError);
      }

      // Create a map of user IDs to emails for quick lookup
      const emailMap: Record<string, string> = {};
      if (Array.isArray(userEmails)) {
        (userEmails as unknown as UserEmailResponse[]).forEach((user: UserEmailResponse) => {
          emailMap[user.id] = user.email;
        });
      }

      // For each profile, fetch their roles
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          // Get user roles using the RPC function
          const { data: roleData, error: roleError } = await supabase
            .rpc("get_user_roles", { user_id: profile.id });
          
          if (roleError) {
            console.error("Error fetching roles:", roleError);
          }
          
          // Handle the roles data properly
          let roles = ['user']; // Default role if none found
          if (Array.isArray(roleData) && roleData.length > 0) {
            roles = roleData.map((r: RoleResponse) => r.role_name);
          }
          
          // Get the real email if available, otherwise fall back to a placeholder
          const email = emailMap[profile.id] || `${profile.username || profile.id}@example.com`;
          
          return {
            id: profile.id,
            email: email,
            fullName: profile.full_name || "",
            username: profile.username || "",
            avatarUrl: profile.avatar_url,
            roles: roles
          };
        })
      );

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error fetching users",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const updateUser = (updatedUser: User) => {
    // Update the user in the state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    // Also update the filtered users list if needed
    setFilteredUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  return {
    users,
    filteredUsers,
    loading,
    searchTerm,
    handleSearchChange,
    updateUser,
    refreshUsers: fetchUsers
  };
}
