
export interface FormAppearance {
  backgroundColor: string;
  logoUrl: string;
  headerText: string;
  subheaderText: string;
}

export const defaultAppearance: FormAppearance = {
  backgroundColor: "#f8f9fa",
  logoUrl: "",
  headerText: "Share Your Story",
  subheaderText: "Help us understand your experience by sharing your story below."
};

export const validateAppearanceData = (data: any): FormAppearance => {
  if (!data || typeof data !== 'object') {
    return { ...defaultAppearance };
  }
  
  return {
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
};
