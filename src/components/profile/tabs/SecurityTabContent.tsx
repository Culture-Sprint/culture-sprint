
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import PasswordChangeForm from "../PasswordChangeForm";
import { PasswordFormValues } from "../PasswordChangeForm";

interface SecurityTabContentProps {
  loading: boolean;
  onPasswordSubmit: (data: PasswordFormValues) => Promise<void>;
}

const SecurityTabContent: React.FC<SecurityTabContentProps> = ({
  loading,
  onPasswordSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your account password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordChangeForm
          onSubmit={onPasswordSubmit}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default SecurityTabContent;
