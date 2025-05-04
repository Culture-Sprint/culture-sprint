
import React, { useState, useEffect } from "react";
import UsersList from "./UsersList";
import UserEditForm from "./UserEditForm";
import AdminHeader from "./AdminHeader";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminContainer = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [hasSuperAdmin, setHasSuperAdmin] = useState(true);
  const { user } = useAuth();
  const [isSettingSuperAdmin, setIsSettingSuperAdmin] = useState(false);

  useEffect(() => {
    // Check if there are any superadmin users
    const checkSuperAdmin = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('role', 'superadmin');
          
        if (error) throw error;
        
        setHasSuperAdmin(data && data.length > 0);
      } catch (err) {
        console.error("Error checking superadmin:", err);
        // Assume there is a superadmin to avoid unintended elevation of privileges
        setHasSuperAdmin(true);
      }
    };
    
    checkSuperAdmin();
  }, [user]);
  
  const setCurrentUserAsSuperAdmin = async () => {
    if (!user) return;
    
    try {
      setIsSettingSuperAdmin(true);
      
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'superadmin' });
        
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "You've been set as a superadmin.",
      });
      
      setHasSuperAdmin(true);
    } catch (err: any) {
      console.error("Error setting superadmin:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to set superadmin role",
        variant: "destructive",
      });
    } finally {
      setIsSettingSuperAdmin(false);
    }
  };
  
  const handleUserUpdate = (updatedUser: User) => {
    // Update the selected user with the new data
    setSelectedUser(updatedUser);
    
    console.log("User updated:", updatedUser);
  };

  return (
    <div className="space-y-6">
      <AdminHeader />
      
      {!hasSuperAdmin && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 mb-4">
          <CardHeader>
            <CardTitle>No Superadmin Found</CardTitle>
            <CardDescription>
              Your system doesn't have a superadmin yet. As the first user, you can become a superadmin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={setCurrentUserAsSuperAdmin}
              disabled={isSettingSuperAdmin}
            >
              {isSettingSuperAdmin ? "Setting up..." : "Make me a Superadmin"}
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UsersList 
            onSelectUser={setSelectedUser} 
            selectedUser={selectedUser}
            onUserUpdate={handleUserUpdate} 
          />
        </div>
        <div className="lg:col-span-2">
          {selectedUser ? (
            <UserEditForm 
              user={selectedUser} 
              onClose={() => setSelectedUser(null)}
              onUserUpdate={handleUserUpdate} 
            />
          ) : (
            <div className="border rounded-lg p-8 text-center bg-muted/20">
              <p className="text-muted-foreground">Select a user to edit their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContainer;
