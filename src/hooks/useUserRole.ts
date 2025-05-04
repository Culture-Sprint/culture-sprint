
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/utils/errorLogging";

export type UserRole = 'superadmin' | 'admin' | 'user' | 'trial' | 'superuser' | 'demo';

interface RoleResponse {
  role_name: string;
}

// Cache to store user roles by user ID
const rolesCache: Record<string, UserRole[]> = {};
// Cache timestamps for expiration
const cacheTimestamps: Record<string, number> = {};
// Cache expiration time (5 minutes in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 1000;
// Flag to prevent concurrent role fetches
const pendingFetches: Record<string, boolean> = {};

interface UseUserRoleReturn {
  roles: UserRole[];
  loading: boolean;
  hasRole: (role: UserRole) => boolean;
  isSuperUser: () => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isDemo: boolean; // Changed from function to boolean for consistency
}

export const useUserRole = (): UseUserRoleReturn => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Check if we have cached roles that haven't expired
        const cacheKey = user.id;
        const cachedRoles = rolesCache[cacheKey];
        const cacheTimestamp = cacheTimestamps[cacheKey] || 0;
        const now = Date.now();
        
        if (cachedRoles && now - cacheTimestamp < CACHE_EXPIRATION) {
          // Use cached roles if available and not expired
          setRoles(cachedRoles);
          setLoading(false);
          return;
        }
        
        // Check if there's already a fetch in progress for this user
        if (pendingFetches[cacheKey]) {
          return;
        }
        
        // Mark that we're fetching for this user
        pendingFetches[cacheKey] = true;
        
        // Fetch roles from Supabase with improved error logging
        console.log("Fetching user roles for user:", user.id);
        const { data, error } = await supabase.rpc('get_user_roles', {
          user_id: user.id  // Using user_id parameter as expected by our SQL function
        });

        if (error) {
          console.error('Error fetching user roles:', error);
          logError(error, 'Error fetching user roles', {
            severity: 'error',
            category: 'auth',
            metadata: { userId: user.id }
          });
          
          setRoles(['user']); // Default to user role if there's an error
        } else {
          // Process the data as an array of RoleResponse objects
          // Ensure data is treated as an array
          const rolesArray = Array.isArray(data) ? data : [];
          const userRoles = rolesArray.map((r: RoleResponse) => r.role_name as UserRole) || ['user'];
          
          console.log("User roles fetched successfully:", userRoles);
          
          // Update cache
          rolesCache[cacheKey] = userRoles;
          cacheTimestamps[cacheKey] = now;
          
          setRoles(userRoles);
        }
        
        // Clear the pending flag
        pendingFetches[cacheKey] = false;
      } catch (error) {
        console.error('Unexpected error fetching user roles:', error);
        logError(error, 'Unexpected error fetching user roles', {
          severity: 'error',
          category: 'auth',
          metadata: { userId: user?.id }
        });
        
        setRoles(['user']); // Default to user role if there's an error
        pendingFetches[user.id] = false;
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
    
    // Clean up function to ensure we clear the pending flag if component unmounts
    return () => {
      if (user?.id) {
        pendingFetches[user.id] = false;
      }
    };
  }, [user?.id]); // Only re-run when user ID changes, not the entire user object

  const hasRole = (role: UserRole) => roles.includes(role);
  const isSuperAdmin = () => hasRole('superadmin');
  const isSuperUser = () => hasRole('superuser') || hasRole('superadmin');
  const isAdmin = () => hasRole('admin') || hasRole('superadmin');
  
  // Change this to a computed boolean property instead of a function
  const isDemo = hasRole('demo');

  return {
    roles,
    loading,
    hasRole,
    isSuperUser,
    isSuperAdmin,
    isAdmin,
    isDemo
  };
};
