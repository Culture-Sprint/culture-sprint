
/**
 * Utility for debugging Supabase queries
 * @param message Debug message to log
 */
export const debugSupabaseQuery = (message: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SupabaseDebug] ${message}`);
  }
};
