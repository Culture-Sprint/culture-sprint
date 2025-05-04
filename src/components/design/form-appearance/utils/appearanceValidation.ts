
import { FormAppearance, defaultAppearance } from "../types";

export const validateAppearanceData = (data: any): FormAppearance => {
  // Check if data is valid
  if (!data || typeof data !== 'object') {
    console.log("Invalid appearance data format, using defaults");
    return { ...defaultAppearance };
  }
  
  // Create validated object with proper fallbacks
  const validatedAppearance: FormAppearance = {
    backgroundColor: typeof data.backgroundColor === 'string' && data.backgroundColor 
      ? data.backgroundColor 
      : defaultAppearance.backgroundColor,
    logoUrl: typeof data.logoUrl === 'string' 
      ? data.logoUrl 
      : defaultAppearance.logoUrl,
    headerText: typeof data.headerText === 'string' && data.headerText 
      ? data.headerText 
      : defaultAppearance.headerText,
    subheaderText: typeof data.subheaderText === 'string' 
      ? data.subheaderText 
      : defaultAppearance.subheaderText
  };
  
  return validatedAppearance;
};
