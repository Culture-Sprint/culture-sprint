
import React from "react";
import { CheckCircle, Circle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityStatusIconProps {
  status: "complete" | "incomplete" | "in_progress" | "error";
  size?: number;
  className?: string;
}

const ActivityStatusIcon: React.FC<ActivityStatusIconProps> = ({ 
  status, 
  size = 4,
  className 
}) => {
  const iconClass = cn(`h-${size} w-${size} flex-shrink-0`, className);

  switch (status) {
    case "complete":
      return <CheckCircle className={cn(iconClass, "text-green-500")} />;
    case "in_progress":
      return <Clock className={cn(iconClass, "text-amber-500")} />;
    case "error":
      return <AlertTriangle className={cn(iconClass, "text-red-500")} />;
    case "incomplete":
    default:
      return <Circle className={cn(iconClass, "text-gray-300")} />;
  }
};

export default ActivityStatusIcon;
