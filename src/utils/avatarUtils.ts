
import MD5 from 'crypto-js/md5';

/**
 * Get a Gravatar URL for a given email address
 * @param email The email address to get the Gravatar for
 * @param size The size of the Gravatar in pixels (default: 80)
 * @returns The URL to the Gravatar image
 */
export const getGravatarUrl = (email: string, size: number = 80): string => {
  // Trim leading and trailing whitespace and convert to lowercase
  const normalizedEmail = email.trim().toLowerCase();
  
  // Create an MD5 hash of the email address (Gravatar requires MD5)
  const hash = MD5(normalizedEmail).toString();
  
  // Construct the Gravatar URL with size and default image parameters
  // d=mp provides a "mystery person" silhouette if no Gravatar exists
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
};

/**
 * Get user initials from a name or email
 * @param name Optional name to extract initials from
 * @param email Optional email to extract initial from if no name is provided
 * @returns The initials (1-2 characters)
 */
export const getUserInitials = (name?: string | null, email?: string | null): string => {
  // If name exists, get initials from name
  if (name) {
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    } else if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
  }
  
  // Fall back to email initial if no name
  if (email) {
    return email[0].toUpperCase();
  }
  
  // Default fallback
  return 'U';
};
