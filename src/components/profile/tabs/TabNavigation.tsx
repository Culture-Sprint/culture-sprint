import React from "react";
import { User, KeyRound, Sparkles, Key } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
  onChange: (value: "profile" | "security" | "ai-settings" | "upgrade") => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onChange }) => {
  return (
    <TabsList className="w-full md:w-auto grid grid-cols-4 md:inline-flex">
      <TabsTrigger
        value="profile"
        className="flex gap-2 items-center"
        onClick={() => onChange("profile")}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Profile</span>
      </TabsTrigger>
      <TabsTrigger
        value="security"
        className="flex gap-2 items-center"
        onClick={() => onChange("security")}
      >
        <KeyRound className="h-4 w-4" />
        <span className="hidden sm:inline">Security</span>
      </TabsTrigger>
      <TabsTrigger
        value="ai-settings"
        className="flex gap-2 items-center"
        onClick={() => onChange("ai-settings")}
      >
        <Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">AI Settings</span>
      </TabsTrigger>
      <TabsTrigger
        value="upgrade"
        className="flex gap-2 items-center"
        onClick={() => onChange("upgrade")}
      >
        <Key className="h-4 w-4" />
        <span className="hidden sm:inline">Upgrade</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default TabNavigation;
