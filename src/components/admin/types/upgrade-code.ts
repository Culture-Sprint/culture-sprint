
export interface UpgradeCode {
  id: string;
  code: string;
  is_used: boolean;
  created_at: string;
  expires_at: string;
  used_by?: string;
  used_at?: string;
}
