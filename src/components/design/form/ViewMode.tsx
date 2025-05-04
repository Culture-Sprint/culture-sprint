
import React from "react";
import { ActivityFormData } from "@/types/activity";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ViewModeProps {
  formData: ActivityFormData;
  onEdit: () => void;
}

const ViewMode: React.FC<ViewModeProps> = ({ formData, onEdit }) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#F2FCE2] p-4 rounded-md border border-green-100 shadow-sm">
        {Object.entries(formData).map(([key, value]) => {
          if (!value || value.trim() === "") return null;
          
          // Format the key for display by capitalizing and replacing underscores with spaces
          const formattedKey = key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          return (
            <div key={key} className="bg-white p-4 rounded-md border border-gray-100 shadow-sm mb-2">
              <h4 className="font-medium text-gray-700 mb-2">{formattedKey}</h4>
              <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
            </div>
          );
        })}
        
        <Button 
          onClick={onEdit}
          variant="outline" 
          className="mt-2 text-culturesprint-600 border-culturesprint-200 hover:bg-culturesprint-50"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Response
        </Button>
      </div>
    </div>
  );
};

export default ViewMode;
