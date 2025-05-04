
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalCommentsProps {
  comments: string;
  onChange: (value: string) => void;
}

const AdditionalComments: React.FC<AdditionalCommentsProps> = ({ comments, onChange }) => {
  return (
    <div className="border-t pt-4 mt-6">
      <Label htmlFor="additionalComments">
        Is there anything else you would like to share about this experience?
      </Label>
      <Textarea 
        id="additionalComments" 
        value={comments}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add any additional thoughts here..."
        className="mt-1"
      />
    </div>
  );
};

export default AdditionalComments;
