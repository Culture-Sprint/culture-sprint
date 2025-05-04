
import React, { useEffect, useRef } from "react";
import { ThemeCluster } from "./types";
import * as d3 from "d3";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import NetworkLegend from "./components/NetworkLegend";
import NetworkVisualization from "./components/NetworkVisualization";

interface NetworkVisualizerProps {
  networkData: any[];
  themeClusters: ThemeCluster[];
  isLoading?: boolean;
  error?: Error | null;
}

const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({
  networkData,
  themeClusters,
  isLoading = false,
  error = null
}) => {
  const simulationRef = useRef<d3.Simulation<any, undefined> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Define the container dimensions
  const width = 800;
  const height = 400;
  
  // Determine if themes have been analyzed
  const hasThemes = themeClusters.length > 0;
  
  // Clean up simulation when component unmounts
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, []);

  // Add logging for debugging
  useEffect(() => {
    console.log("NetworkVisualizer rendering with:", { 
      networkDataCount: networkData.length, 
      themeClustersCount: themeClusters.length,
      isLoading,
      hasError: error !== null
    });
  }, [networkData, themeClusters, isLoading, error]);
  
  // Run force simulation for theme view
  useEffect(() => {
    if (networkData.length === 0 || !containerRef.current) {
      return;
    }
    
    console.log("Starting theme-based force simulation");
    
    // Stop any existing simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
    
    // Create the simulation with forces
    const simulation = d3.forceSimulation(networkData)
      // X force - attraction to theme center with very reduced strength to allow more spread
      .force("x", d3.forceX().strength(0.2).x(d => {
        // Use the themeX property set in useNetworkData
        return d.themeX || width / 2;
      }))
      // Y force - much weaker attraction to vertical center with significant randomness
      .force("y", d3.forceY().strength(0.02).y(d => height / 2 + (Math.random() * 120 - 60)))
      // Collision detection - increased radius to prevent overlap
      .force("collide", d3.forceCollide().radius(d => Math.max(30, Math.min(45, d.z * 3) + 5)).strength(0.95))
      // Charge - stronger node repulsion to spread them more
      .force("charge", d3.forceManyBody().strength(-100))
      .alphaDecay(0.03); // Even slower decay for more movement
    
    // Update node positions on each tick to cause a re-render
    simulation.on("tick", () => {
      // Force re-render by calling useState set function
      // This is handled by React's state management
    });
    
    // Store the simulation in the ref
    simulationRef.current = simulation;
    
    // Start the simulation
    simulation.alpha(1).restart();
    
    return () => {
      console.log("Stopping force simulation");
      simulation.stop();
    };
  }, [networkData, width, height]);
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState error={error} />;
  }
  
  return (
    <div 
      className={`w-full relative transition-all duration-500 ease-in-out ${hasThemes ? 'h-[400px]' : 'h-[150px]'}`}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50/30 rounded-md overflow-hidden">
        <NetworkVisualization 
          networkData={networkData}
          width={width}
          height={height}
          containerRef={containerRef}
          themeClusters={themeClusters}
        />
      </div>
      
      {hasThemes && <NetworkLegend themeClusters={themeClusters} />}
    </div>
  );
};

export default NetworkVisualizer;
