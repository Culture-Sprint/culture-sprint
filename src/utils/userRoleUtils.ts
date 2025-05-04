
import { useUserRole } from "@/hooks/useUserRole";

/**
 * Utility component providing access to user role information
 */
export const useUserRoleUtils = () => {
  const { isDemo, isSuperAdmin, isAdmin, isSuperUser, hasRole } = useUserRole();

  /**
   * Check if the user can edit template projects
   */
  const canEditTemplates = isSuperAdmin();

  /**
   * Check if the user has access to the admin panel
   */
  const hasAdminAccess = isSuperUser() || isAdmin();

  /**
   * Check if a template project can be modified by this user
   */
  const canModifyTemplate = (isTemplate: boolean) => {
    return !isTemplate || canEditTemplates;
  };

  /**
   * Check if a feature is available to the current user based on their role
   */
  const canAccessFeature = (
    feature: 'premium' | 'admin' | 'supervAdmin' | 'template-edit',
    context?: Record<string, any>
  ) => {
    switch (feature) {
      case 'premium':
        return !isDemo;
      case 'admin':
        return hasAdminAccess;
      case 'supervAdmin':
        return isSuperAdmin();
      case 'template-edit':
        return canModifyTemplate(context?.isTemplate || false);
      default:
        return true;
    }
  };

  return {
    isDemo,
    isSuperAdmin,
    isAdmin,
    isSuperUser,
    hasRole,
    hasAdminAccess,
    canEditTemplates,
    canModifyTemplate,
    canAccessFeature
  };
};
