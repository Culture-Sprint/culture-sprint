
import { FormCacheManager } from './managers/formCacheManager';
import { ProjectCacheManager } from './managers/projectCacheManager';
import { ActivityCacheManager } from './managers/activityCacheManager';
import { ContextCacheManager } from './managers/contextCacheManager';
import { ResponseCacheManager } from './managers/responseCacheManager';
import { BaseCacheManager } from './managers/baseCacheManager';

class CacheManager extends BaseCacheManager {
  readonly form: FormCacheManager;
  readonly project: ProjectCacheManager;
  readonly activity: ActivityCacheManager;
  readonly context: ContextCacheManager;
  readonly response: ResponseCacheManager;

  constructor() {
    super();
    this.form = new FormCacheManager();
    this.project = new ProjectCacheManager();
    this.activity = new ActivityCacheManager();
    this.context = new ContextCacheManager();
    this.response = new ResponseCacheManager();
  }

  // Expose isValid from BaseCacheManager
  isValid(key: string, options = {}): boolean {
    return super.isValid(key, options);
  }
}

// Export a singleton instance
export const cacheManager = new CacheManager();

// For direct imports
export default cacheManager;
