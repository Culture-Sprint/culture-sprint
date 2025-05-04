
import React from "react";
import { Edit, Smile, Meh, Frown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface EmotionalResponseProps {
  feeling: string;
  otherFeeling: string;
  onFeelingChange: (value: string) => void;
  onOtherFeelingChange: (value: string) => void;
  isPublic?: boolean;
}

const EmotionalResponse: React.FC<EmotionalResponseProps> = ({
  feeling,
  otherFeeling,
  onFeelingChange,
  onOtherFeelingChange,
  isPublic = false
}) => {
  return (
    <div className="mt-8 mb-4">
      <Label className={`flex items-center gap-1 mb-4 text-base ${isPublic ? 'text-gray-700' : ''}`}>
        Emotional response
      </Label>
      <RadioGroup value={feeling} onValueChange={onFeelingChange} className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="enthusiastic" id="feeling-enthusiastic" />
          <Label htmlFor="feeling-enthusiastic" className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-green-500" />
            <span>Enthusiastic</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="confused" id="feeling-confused" />
          <Label htmlFor="feeling-confused" className="flex items-center gap-2">
            <Meh className="h-5 w-5 text-blue-500" />
            <span>Confused</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="frustrated" id="feeling-frustrated" />
          <Label htmlFor="feeling-frustrated" className="flex items-center gap-2">
            <Frown className="h-5 w-5 text-red-500" />
            <span>Frustrated</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="engaged" id="feeling-engaged" />
          <Label htmlFor="feeling-engaged" className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-purple-500" />
            <span>Engaged</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="other" id="feeling-other" />
          <Label htmlFor="feeling-other" className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-gray-500" />
            <span>Other</span>
          </Label>
        </div>
      </RadioGroup>
      
      {feeling === "other" && (
        <div className="mt-4 ml-7">
          <Input 
            value={otherFeeling}
            onChange={(e) => onOtherFeelingChange(e.target.value)}
            placeholder="Describe how you felt..."
            className={isPublic ? 'border-blue-200 focus:border-blue-400' : ''}
          />
        </div>
      )}
    </div>
  );
};

export default EmotionalResponse;
