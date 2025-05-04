
import React, { useState, useRef, useEffect } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import StoryCircle from "../StoryCircle";
import StoryTooltip from "./StoryTooltip";
import ZoomControls from "./ZoomControls";
import { NodeData } from "../types";
import { FormErrorFallback } from "@/components/ui/form-error-fallback";

interface NetworkVisualizationProps {
  networkData: NodeData[];
  width: number;
  height: number;
  containerRef: React.RefObject<HTMLDivElement>;
  themeClusters: { theme: string; stories: any[]; color: string }[];
}

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  networkData,
  width,
  height,
  containerRef,
  themeClusters
}) => {
  const [selectedStory, setSelectedStory] = useState<NodeData | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const visualizationRef = useRef<HTMLDivElement>(null);
  const [visualizationError, setVisualizationError] = useState<Error | null>(null);
  
  const handleStoryClick = (story: NodeData) => {
    try {
      console.log("Story clicked:", story);
      setSelectedStory(prev => prev?.id === story.id ? null : story);
    } catch (error) {
      console.error("Error handling story click:", error);
      setVisualizationError(error instanceof Error ? error : new Error("Unknown error"));
    }
  };
  
  const closeTooltip = () => {
    setSelectedStory(null);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2.5));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if clicking the background, not a circle
    if (e.target === visualizationRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      setPanPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        
        // Zoom with mouse wheel
        const zoomFactor = 0.1;
        const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
        setZoomLevel(prev => Math.max(0.5, Math.min(2.5, prev + delta)));
      }
    };
    
    // Add wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef]);
  
  const transformStyle = {
    transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
  };
  
  // Don't render the visualization until themes have been analyzed
  if (themeClusters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Click "Analyze Themes" to visualize story connections</p>
      </div>
    );
  }
  
  // Handle any visualization errors
  if (visualizationError) {
    return (
      <FormErrorFallback
        error={visualizationError}
        title="Visualization Error"
        message="An error occurred while rendering the network visualization."
        resetError={() => setVisualizationError(null)}
      />
    );
  }
  
  return (
    <ErrorBoundary
      fallback={
        <FormErrorFallback
          title="Visualization Error"
          message="Something went wrong while displaying the network visualization."
          resetError={() => window.location.reload()}
        />
      }
      componentName="NetworkVisualization"
    >
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Render the circles as absolutely positioned divs */}
        <div 
          ref={visualizationRef}
          className="absolute inset-0"
          style={transformStyle}
          onClick={(e) => {
            // Close tooltip when clicking on the background, but not on the circles or tooltip
            if (e.target === visualizationRef.current) {
              setSelectedStory(null);
            }
          }}
        >
          {networkData.map(node => (
            <StoryCircle
              key={node.id}
              node={node}
              onClick={() => handleStoryClick(node)}
              isSelected={selectedStory?.id === node.id}
              viewMode="theme"
            />
          ))}
        </div>
        
        {selectedStory && (
          <StoryTooltip 
            story={selectedStory} 
            onClose={closeTooltip}
            width={width}
            height={height}
          />
        )}
        
        <ZoomControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          zoomLevel={zoomLevel}
        />
      </div>
    </ErrorBoundary>
  );
};

export default NetworkVisualization;
