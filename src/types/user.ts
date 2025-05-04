
export interface User {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  avatarUrl?: string | null;
  roles: string[];
  isDemo?: boolean; // New flag to identify demo users
}
