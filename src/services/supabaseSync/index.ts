
// Re-export utilities for syncing
export { isAuthenticated } from './operations';
export { debugSupabaseQuery } from './operations/core/debugUtils';
export { fetchActivityResponse, saveActivityResponse } from './operations';
export { asJsonObject } from './core/typeUtils';
export type { FetchActivityResponseResult } from './types/responseTypes';
