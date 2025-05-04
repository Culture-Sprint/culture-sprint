
/**
 * Browser storage implementation (localStorage and sessionStorage)
 */
import { getStorageObject } from './cacheConfig';

/**
 * Get an item from browser storage
 */
export const getFromBrowserStorage = <T>(
  key: string,
  defaultValue: T,
  storage: 'session' | 'local',
  expiration: number = -1
): T => {
  const storageObj = getStorageObject(storage);
  if (!storageObj) return defaultValue;
  
  const serializedItem = storageObj.getItem(key);
  if (!serializedItem) return defaultValue;

  // Check for timestamp metadata
  const timestampKey = `${key}_timestamp`;
  const timestampValue = storageObj.getItem(timestampKey);
  
  if (timestampValue && expiration !== -1) {
    const timestamp = parseInt(timestampValue, 10);
    if (Date.now() - timestamp > expiration) {
      // Cache expired, remove it
      storageObj.removeItem(key);
      storageObj.removeItem(timestampKey);
      return defaultValue;
    }
  }
  
  return JSON.parse(serializedItem) as T;
};

/**
 * Set an item in browser storage
 */
export const setInBrowserStorage = <T>(
  key: string,
  data: T,
  storage: 'session' | 'local',
  ttl?: number
): void => {
  const storageObj = getStorageObject(storage);
  if (!storageObj) return;
  
  const serializedData = JSON.stringify(data);
  
  // Store the data and timestamp
  storageObj.setItem(key, serializedData);
  storageObj.setItem(`${key}_timestamp`, Date.now().toString());
};

/**
 * Remove an item from browser storage
 */
export const removeFromBrowserStorage = (
  key: string,
  storage: 'session' | 'local'
): void => {
  const storageObj = getStorageObject(storage);
  if (!storageObj) return;
  
  storageObj.removeItem(key);
  storageObj.removeItem(`${key}_timestamp`);
};

/**
 * Clear items from browser storage by pattern
 */
export const clearBrowserStorageByPattern = (
  pattern: string,
  storage: 'session' | 'local'
): void => {
  const storageObj = getStorageObject(storage);
  if (!storageObj) return;
  
  const keys = [];
  
  for (let i = 0; i < storageObj.length; i++) {
    const key = storageObj.key(i);
    if (key && key.includes(pattern)) {
      keys.push(key);
    }
  }
  
  // Remove all matching keys
  keys.forEach(key => {
    storageObj.removeItem(key);
    // Also remove timestamp entries
    storageObj.removeItem(`${key}_timestamp`);
  });
};

/**
 * Check if an item in browser storage is valid
 */
export const isBrowserStorageItemValid = (
  key: string,
  storage: 'session' | 'local',
  expiration: number
): boolean => {
  const storageObj = getStorageObject(storage);
  if (!storageObj) return false;
  
  const serializedItem = storageObj.getItem(key);
  if (!serializedItem) return false;

  // Check for timestamp metadata
  const timestampKey = `${key}_timestamp`;
  const timestampValue = storageObj.getItem(timestampKey);
  
  if (timestampValue) {
    const timestamp = parseInt(timestampValue, 10);
    return Date.now() - timestamp <= expiration;
  }
  
  return true; // No timestamp, assume valid
};
