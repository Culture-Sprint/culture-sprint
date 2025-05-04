
import React from "react";
import { useForm } from "@/contexts/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalCommentsProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isPublic?: boolean;
}

const AdditionalComments: React.FC<AdditionalCommentsProps> = ({ 
  value, 
  onChange,
  isPublic = false
}) => {
  const { additionalComments, setAdditionalComments } = useForm();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalComments(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`border-t pt-4 mt-6 ${isPublic ? 'border-blue-100' : ''}`}>
      <Label 
        htmlFor="additionalComments"
        className={isPublic ? 'text-gray-700' : ''}
      >
        Is there anything else you would like to share about this experience?
      </Label>
      <Textarea 
        id="additionalComments" 
        value={additionalComments}
        onChange={handleChange}
        placeholder="Add any additional thoughts here..."
        className={`mt-1 ${isPublic ? 'border-blue-200 focus:border-blue-400' : ''}`}
      />
    </div>
  );
};

export default AdditionalComments;
