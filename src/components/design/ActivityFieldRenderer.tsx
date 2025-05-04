
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "./utils/fields";
import { Slider } from "@/components/ui/slider";

interface ActivityFieldRendererProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  activityId: string;
}

const ActivityFieldRenderer: React.FC<ActivityFieldRendererProps> = ({
  field,
  value,
  onChange,
  activityId,
}) => {
  const fieldId = `${activityId}-${field.id}`;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  
  const handleSliderChange = (values: number[]) => {
    onChange(values[0].toString());
  };
  
  return (
    <div key={field.id} className="space-y-2">
      <Label htmlFor={fieldId}>{field.label}</Label>
      {field.isSlider ? (
        <div className="pt-5 px-2">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{field.leftLabel || 'Low'}</span>
            <span>{field.rightLabel || 'High'}</span>
          </div>
          <Slider
            id={fieldId}
            defaultValue={[value ? parseInt(value) : 50]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
          />
        </div>
      ) : field.isTextarea ? (
        <Textarea
          id={fieldId}
          value={value || ""}
          onChange={handleChange}
          rows={5}
          className="w-full"
          placeholder={`Enter your ${field.label.toLowerCase()}...`}
        />
      ) : (
        <Input
          id={fieldId}
          value={value || ""}
          onChange={handleChange}
          className="w-full"
          placeholder={`Enter your ${field.label.toLowerCase()}...`}
        />
      )}
    </div>
  );
};

export default ActivityFieldRenderer;
