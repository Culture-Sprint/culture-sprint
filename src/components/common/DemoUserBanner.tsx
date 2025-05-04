
import { Info, AlertTriangle } from "lucide-react";
import { useDemoUserStatus } from "@/hooks/useDemoUserStatus";
import { Progress } from "@/components/ui/progress";

interface DemoUserBannerProps {
  projectId?: string | null;
  showStoryCount?: boolean;
  variant?: "info" | "warning";
  className?: string;
  withProgress?: boolean;
}

/**
 * A reusable component to display demo user information and limitations
 */
const DemoUserBanner: React.FC<DemoUserBannerProps> = ({
  projectId,
  showStoryCount = true,
  variant = "info",
  className = "",
  withProgress = true
}) => {
  const { isDemo, storyCount, maxStories, hasReachedLimit, limitPercentage, isLoading } = useDemoUserStatus(projectId);
  
  if (!isDemo) {
    return null;
  }
  
  const bgColor = variant === "warning" ? "bg-amber-50" : "bg-blue-50";
  const textColor = variant === "warning" ? "text-amber-700" : "text-blue-700";
  const borderColor = variant === "warning" ? "border-amber-200" : "border-blue-200";
  const progressColor = hasReachedLimit ? "bg-red-500" : limitPercentage > 80 ? "bg-amber-500" : "bg-blue-500";
  
  const Icon = variant === "warning" ? AlertTriangle : Info;
  
  return (
    <div className={`rounded p-3 ${bgColor} ${textColor} border ${borderColor} ${className}`}>
      <div className="flex items-start gap-2">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold">Demo Account</p>
          <p className="text-sm">
            You're using a demo account with limited functionality.
          </p>
          
          {showStoryCount && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Story Collection Limit</span>
                <span>
                  {isLoading ? "Loading..." : `${storyCount} / ${maxStories} stories`}
                </span>
              </div>
              
              {withProgress && (
                <Progress 
                  value={limitPercentage} 
                  max={100}
                  className={`h-2 ${progressColor}`}
                />
              )}
              
              {hasReachedLimit && (
                <p className="text-xs mt-1 font-medium text-red-600">
                  You've reached the maximum number of stories for a demo account.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoUserBanner;
