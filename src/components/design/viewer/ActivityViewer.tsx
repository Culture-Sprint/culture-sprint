
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ActivityForm from "../ActivityForm";
import { toast } from "@/components/ui/use-toast";

interface ActivityViewerProps {
  phaseId: string;
  stepId: string;
  activity: {
    id: string;
    title: string;
    description: string;
  };
  onBackToActivities: () => void;
  onActivitySaved: (activityId: string) => void;
}

const ActivityViewer: React.FC<ActivityViewerProps> = ({
  phaseId,
  stepId,
  activity,
  onBackToActivities,
  onActivitySaved,
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  
  // Reset the saved state when activity changes
  useEffect(() => {
    setHasBeenSaved(false);
  }, [activity.id]);
  
  const handleActivitySaved = () => {
    console.log(`Activity ${activity.id} saved, notifying parent component`);
    
    // Notify parent component
    onActivitySaved(activity.id);
    
    // Mark as saved to prevent multiple notifications
    setHasBeenSaved(true);
    
    // Force refresh the activity form
    setRefreshKey(prev => prev + 1);
    
    // Show success notification
    toast({
      title: "Saved Successfully",
      description: "Your changes have been saved",
    });
    
    // Set a timeout to refresh again after a short delay to ensure data is updated
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 500);
  };
  
  return (
    <div className="space-y-8">
      <Card className="border-culturesprint-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
          <h3 className="text-xl font-semibold text-culturesprint-800">
            {activity.title}
          </h3>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <ActivityForm
            key={`activity-form-${refreshKey}`}
            phaseId={phaseId}
            stepId={stepId}
            activityId={activity.id}
            activityTitle={activity.title}
            activityDescription={activity.description}
            onComplete={onBackToActivities}
            onSaved={handleActivitySaved}
          />
          
          <div className="pt-4 border-t border-gray-100">
            <Button 
              variant="ghost" 
              onClick={onBackToActivities}
              className="flex items-center gap-2 text-culturesprint-700 hover:bg-culturesprint-100"
            >
              <ArrowLeft size={16} />
              Back to activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityViewer;
