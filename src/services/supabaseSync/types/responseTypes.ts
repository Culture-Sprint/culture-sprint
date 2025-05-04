
/**
 * Result type for fetch_activity_response RPC function
 */
export interface FetchActivityResponseResult {
  found: boolean;
  data?: {
    ar_response: any;
    id: string;
    created_at: string;
    updated_at: string;
  };
  error?: string;
  error_code?: string;
}
