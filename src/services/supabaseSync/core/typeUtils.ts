
import { Json } from "@/integrations/supabase/types";

/**
 * Convert any type to a JSON object
 */
export const asJsonObject = <T>(data: T): Json => {
  if (typeof data === 'object' && data !== null) {
    return data as Json;
  }
  return {} as Json;
};
