
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { FormField as FormFieldType } from "./utils/fields";

interface FormFieldProps {
  field: FormFieldType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { id: string; value: number[] }) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange }) => {
  const handleSliderChange = (values: number[]) => {
    onChange({ id: field.id, value: values });
  };

  if (field.isSlider) {
    const sliderValue = !isNaN(parseInt(value)) ? [parseInt(value)] : [field.sliderValue || 50];

    return (
      <div className="space-y-2">
        <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
          {field.label}
        </Label>
        
        <div className="pt-5 pb-2">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">{field.leftLabel || "Not at all"}</span>
            <span className="text-xs text-gray-500">{field.rightLabel || "Very much"}</span>
          </div>
          <Slider 
            id={field.id}
            defaultValue={sliderValue} 
            value={sliderValue}
            onValueChange={handleSliderChange}
            max={100} 
            step={1} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
        {field.label}
      </Label>
      
      {field.isTextarea ? (
        <Textarea
          id={field.id}
          name={field.id}
          value={value || ""}
          onChange={onChange}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className="min-h-[100px] w-full"
        />
      ) : (
        <Input
          type="text"
          id={field.id}
          name={field.id}
          value={value || ""}
          onChange={onChange}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          className="w-full"
        />
      )}
    </div>
  );
};

export default FormField;
