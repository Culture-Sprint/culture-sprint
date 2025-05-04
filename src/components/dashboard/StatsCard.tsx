
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: React.ReactNode;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    className: string;
  };
}

const StatsCard = ({ title, value, subtitle, icon: Icon, badge }: StatsCardProps) => {
  return (
    <Card className="shadow-md border-opacity-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
        <CardTitle className="text-sm font-medium text-primary">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary opacity-80" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {badge && (
            <Badge className={badge.className}>
              {badge.text}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
