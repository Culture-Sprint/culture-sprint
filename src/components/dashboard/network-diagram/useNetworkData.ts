
import { useMemo } from "react";
import { NodeData, ThemeCluster } from "./types";
import { Story } from "@/types/story";

export const useNetworkData = (
  stories: Story[],
  themeClusters: ThemeCluster[]
) => {
  return useMemo(() => {
    if (!stories.length) return [];
    
    // Log out information for debugging
    console.log("Generating network data with:", { 
      storiesCount: stories.length, 
      themeClusters: themeClusters.length 
    });
    
    if (themeClusters.length > 0) {
      return generateThemeNetworkData(stories, themeClusters);
    } else {
      // Return empty array if no theme clusters available
      console.log("No theme clusters available, returning empty network data");
      return [];
    }
  }, [stories, themeClusters]);
};

const generateThemeNetworkData = (
  stories: Story[],
  themeClusters: ThemeCluster[]
): NodeData[] => {
  const nodes: NodeData[] = [];
  const width = 800; // Width of the visualization
  const height = 400; // Height of the visualization
  
  console.log("Generating theme network data with clusters:", themeClusters.map(c => ({
    theme: c.theme,
    storiesCount: c.stories.length,
    color: c.color
  })));
  
  // Calculate positions for each theme cluster
  // We'll place them with more space between clusters
  const themeCount = themeClusters.length;
  
  themeClusters.forEach((cluster, clusterIndex) => {
    const storiesInTheme = cluster.stories;
    const storyCount = storiesInTheme.length;
    
    console.log(`Theme: ${cluster.theme}, Stories: ${storyCount}`);
    
    if (storyCount === 0) return;
    
    // Calculate a position for this cluster
    // Set horizontal position with more spacing between clusters
    const padding = 100; // padding from edges
    const availableWidth = width - (padding * 2);
    const clusterX = themeCount > 1 
      ? padding + (availableWidth * clusterIndex / (themeCount - 1)) 
      : width / 2;
    
    // Calculate a vertical offset for each cluster to increase vertical spread
    // Alternating clusters up and down from center
    const verticalOffset = clusterIndex % 2 === 0 ? -40 : 40;
    const clusterY = height / 2 + verticalOffset;
    
    // For each story in the theme, create a node with initial position
    // around the cluster center but more spread out
    storiesInTheme.forEach((storyRef, idx) => {
      // Find the full story object from the stories array by matching the ID
      // This is needed because the cluster's stories array only has IDs
      const storyId = typeof storyRef.id === 'string' ? storyRef.id : String(storyRef.id);
      const fullStory = stories.find(s => 
        (typeof s.id === 'string' ? s.id : String(s.id)) === storyId
      );
      
      // Skip if story not found in the full stories array
      if (!fullStory) {
        console.warn(`Story with ID ${storyId} not found in stories array`);
        return;
      }
      
      // Use index to create a deterministic but more spread out position
      const angle = (idx / storyCount) * (Math.PI * 2);
      // Much larger radius to create more vertical and horizontal space between nodes
      const radius = 70 + (Math.random() * 60);
      
      const x = clusterX + radius * Math.cos(angle);
      const y = clusterY + radius * Math.sin(angle);
      
      nodes.push({
        x,
        y,
        z: fullStory.impact || 1,
        name: fullStory.title,
        id: storyId,
        sentiment: fullStory.feelingSentiment || "undefined",
        fill: cluster.color,
        theme: cluster.theme,
        // Store the theme center position for the force simulation
        themeX: clusterX,
      });
    });
  });
  
  console.log(`Generated ${nodes.length} nodes for theme visualization`);
  
  if (nodes.length === 0) {
    console.warn("No nodes generated for theme visualization!");
    console.warn("Theme clusters:", themeClusters);
    console.warn("Stories:", stories.slice(0, 3)); // Log a sample of stories
  }
  
  return nodes;
};
