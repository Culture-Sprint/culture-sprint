
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Organization } from "@/types/organization";
import { toast } from "@/components/ui/use-toast";

/**
 * @deprecated This hook is deprecated and will be removed in future versions.
 * Organization functionality is not currently in use.
 */
export const useUserOrganization = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  // Deprecated stub implementation
  const fetchOrganizations = async () => {
    console.warn("useUserOrganization is deprecated and will be removed in future versions");
    return [];
  };

  const switchOrganization = (orgId: string) => {
    console.warn("useUserOrganization is deprecated and will be removed in future versions");
  };

  const refreshOrganizations = () => {
    console.warn("useUserOrganization is deprecated and will be removed in future versions");
    return Promise.resolve();
  };

  return {
    organizations,
    loading,
    currentOrg,
    switchOrganization,
    refreshOrganizations
  };
};
