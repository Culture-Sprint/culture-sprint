
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomLevel: number;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  zoomLevel
}) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/80 p-2 rounded-md shadow-md backdrop-blur-sm">
      <Button 
        variant="outline" 
        size="icon"
        onClick={onZoomIn}
        className="bg-white hover:bg-gray-100"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <div className="text-xs text-center font-mono bg-gray-50 rounded px-2 py-1">
        {Math.round(zoomLevel * 100)}%
      </div>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={onZoomOut}
        className="bg-white hover:bg-gray-100"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ZoomControls;
