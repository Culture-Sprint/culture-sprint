
export interface Organization {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  created_by?: string;
}

export interface OrganizationMember {
  user_id: string;
  org_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at?: string;
}
