
# Form Data Handling Hooks

## Recent Refactoring

This directory contains both legacy and new unified hooks for form data handling. The goal of the refactoring was to reduce duplication and simplify the codebase.

## New Structure

- `useUnifiedFormDataLoader.ts` - Main entry point for form data loading
- `form-cache/useFormDataCache.ts` - Unified caching functionality
- `form-fetch/useFormDataFetchUtils.ts` - Unified fetch utilities

## Legacy Hooks (Maintained for Backward Compatibility)

- `useFormCache.ts` - Basic cache operations
- `useFormDataHelper.ts` - Helper functions for form data loading
- `useFormDataFetcher.ts` - Form data fetching with some caching
- `useFormDataLoader.ts` - Form data loading with cache and refresh

## Migration Path

To migrate to the new hooks:

1. Replace `useFormDataLoader` with `useUnifiedFormDataLoader`
2. Use the new hook's methods for caching and refreshing operations
3. If using `useFormDataHelper` or `useFormDataFetcher` directly, migrate to the specific utility hooks

## Testing the New Implementation

We've added testing mechanisms to compare the new unified implementation with the legacy one:

1. **For public forms**:
   - Go to any public form URL
   - If logged in as superadmin, you'll see a toggle button in the top right corner
   - Switch between legacy and new implementation to compare behavior

2. **For authenticated forms** (on the Collect page):
   - As a superadmin, you'll see a toggle for "Use Unified Form Loader"
   - Toggle between implementations to compare behavior

3. **What to test**:
   - Form data loading in both online and offline modes
   - Caching behavior when navigating away and back
   - Error handling when network issues occur
   - Performance differences between implementations

4. **Reporting issues**:
   - Document any differences in behavior between implementations
   - Note any errors that occur in one implementation but not the other
   - Track performance differences if noticeable

## Example Usage

```tsx
import { useUnifiedFormDataLoader } from "@/hooks/collect/useUnifiedFormDataLoader";

const MyComponent = ({ projectId }) => {
  const {
    storyQuestion,
    sliderQuestions,
    participantQuestions,
    isLoading,
    refreshFormData,
    reloadFromRemote
  } = useUnifiedFormDataLoader(projectId);
  
  // Use the form data...
  
  return (
    <div>
      {isLoading ? (
        <LoadingState />
      ) : (
        <Form 
          storyQuestion={storyQuestion}
          sliderQuestions={sliderQuestions}
          participantQuestions={participantQuestions}
        />
      )}
      
      <button onClick={refreshFormData}>Refresh Data</button>
      <button onClick={reloadFromRemote}>Reload From Remote</button>
    </div>
  );
};
```

