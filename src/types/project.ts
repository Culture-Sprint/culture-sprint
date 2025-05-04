
export type Project = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_template?: boolean;
  _clone?: boolean; // Flag to identify client-side clones
};

