
export const generateThemeColors = (count: number) => {
  // Using the website's brand colors and complementary shades
  const colors = [
    "#180572", // Primary brand color - deep purple
    "#E2005A", // Secondary brand color - bright pink
    "#9995C2", // Accent color - light purple
    "#7A0266", // Tertiary color - dark pink
    "#605897", // Medium purple
    "#c7c3e3", // Light purple
    "#0f0241", // Very dark purple
    "#e3e1f1", // Very light purple
    "#150461", // Dark purple
  ];
  
  return Array(count).fill(0).map((_, i) => colors[i % colors.length]);
};
