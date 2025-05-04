
export interface ThemeCluster {
  theme: string;
  stories: { id: string | number; }[];
  color: string;
}

export const sentimentColors = {
  positive: "#22c55e", // Green
  neutral: "#9ca3af", // Gray
  negative: "#ef4444", // Red
};

export interface NodeData {
  x: number;
  y: number;
  z: number;
  name: string;
  id: string;
  sentiment: "positive" | "neutral" | "negative" | "undefined";
  fill: string;
  theme?: string;
  themeX?: number; // Add the theme center X position
}

// Add the missing interface that was referenced by NetworkDiagramSection
export interface NetworkDiagramSectionProps {
  stories: any[]; // Using any[] since we're passing Story[] but probably need more specific type
  isLoading?: boolean;
}
