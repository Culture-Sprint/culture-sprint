
import React from "react";
import { Layers, Palette } from "lucide-react";
import { DesignPhase } from "../types/designTypes";
import FormDesigner from "@/components/design/FormDesigner";
import FormAppearance from "@/components/design/form-appearance/FormAppearance";

export const buildPhase: DesignPhase = {
  id: "build",
  title: "Build",
  description: "Build and design your story form",
  icon: <Layers className="h-5 w-5" />,
  steps: [
    {
      id: "form-design",
      title: "Form Design",
      description: "Design the appearance and flow of your story form",
      activities: [
        {
          id: "form-builder",
          title: "Form Builder",
          description: "Design the appearance and flow of your story form",
          component: <FormDesigner />
        }
      ]
    },
    {
      id: "form-appearance",
      title: "Form Appearance",
      description: "Customize the look and feel of your public form",
      activities: [
        {
          id: "form-appearance-editor",
          title: "Form Appearance",
          description: "Change the colors, logo, and headings of your public form",
          component: <FormAppearance />,
          hideActivityContent: true // Hide the activity content for this specific activity
        }
      ]
    }
  ]
};
