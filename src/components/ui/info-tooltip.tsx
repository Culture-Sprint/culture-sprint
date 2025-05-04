
import React, { useState } from "react";
import { HelpCircle, Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { getTooltipContent } from "@/utils/tooltipContent";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface InfoTooltipProps {
  /** Key for the tooltip content, matches a key in tooltipContent */
  contentKey: string;
  /** Optional custom tooltip content, overrides contentKey */
  content?: string;
  /** Icon to use (default: Info) */
  icon?: "info" | "help";
  /** Size of the icon */
  size?: number;
  /** Whether to use popover instead of tooltip */
  usePopover?: boolean;
  /** Additional class name for the icon */
  className?: string;
  /** Position of the tooltip */
  position?: "top" | "bottom" | "left" | "right";
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  contentKey,
  content,
  icon = "info",
  size = 16,
  usePopover = false,
  className,
  position = "top",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipText = content || getTooltipContent(contentKey);
  const IconComponent = icon === "info" ? Info : HelpCircle;
  
  // The icon button that will be used in all variations
  const IconButton = (
    <button 
      className="focus:outline-none" 
      aria-label="View information"
      onClick={() => setIsOpen(true)}
    >
      <span className="flex items-center justify-center rounded-full bg-amber-100 p-1">
        <IconComponent 
          size={size} 
          className={cn("text-black", className)} 
        />
      </span>
    </button>
  );
  
  // Use dialog for mobile-friendly click interactions
  return (
    <>
      {/* Hover tooltip functionality */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {IconButton}
          </TooltipTrigger>
          <TooltipContent 
            side={position} 
            className="max-w-xs p-2 bg-amber-100 text-black border-amber-200 font-medium"
          >
            <p className="text-xs">{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Click to open dialog functionality */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm bg-amber-100 text-black border-amber-200">
          <div className="p-2">
            <p className="text-sm font-medium">{tooltipText}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { InfoTooltip };
