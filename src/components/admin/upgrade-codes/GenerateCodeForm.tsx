
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GenerateCodeFormProps {
  onGenerateCode: (days: string) => Promise<void>;
  isGenerating: boolean;
}

const GenerateCodeForm = ({ onGenerateCode, isGenerating }: GenerateCodeFormProps) => {
  const [expirationDays, setExpirationDays] = useState("365");

  return (
    <div className="flex gap-4">
      <Input
        type="number"
        value={expirationDays}
        onChange={(e) => setExpirationDays(e.target.value)}
        placeholder="Expiration days"
        className="w-32"
      />
      <Button onClick={() => onGenerateCode(expirationDays)} disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate New Code"}
      </Button>
    </div>
  );
};

export default GenerateCodeForm;
