
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import GenerateCodeForm from "./upgrade-codes/GenerateCodeForm";
import CodesTable from "./upgrade-codes/CodesTable";
import { useUpgradeCodes } from "./upgrade-codes/useUpgradeCodes";

const CodeManagement = () => {
  const { user } = useAuth();
  const { codes, loading, generatingCode, generateCode } = useUpgradeCodes(user?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Code Management</CardTitle>
        <CardDescription>Generate and manage upgrade codes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <GenerateCodeForm 
            onGenerateCode={generateCode} 
            isGenerating={generatingCode} 
          />
          <CodesTable codes={codes} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeManagement;
