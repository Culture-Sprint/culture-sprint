
/**
 * Returns the base URL to use for public form links
 * Defaults to current domain
 */
export const getPublicFormBaseUrl = (): string => {
  return window.location.origin;
};
