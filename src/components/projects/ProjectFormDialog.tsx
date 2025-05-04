
import React, { useState, useEffect } from "react";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, description: string) => void;
  project?: Project | null;
  mode: "create" | "edit";
  isTemplate?: boolean;
}

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  project,
  mode,
  isTemplate = false
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (project && mode === "edit") {
      setFormData({
        name: project.name,
        description: project.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [project, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData.name, formData.description);
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
    onOpenChange(false);
  };

  let title = mode === "create" ? "Create New Project" : "Edit Project";
  let description = mode === "create" 
    ? "Enter details for your new project" 
    : "Update your project details";
  
  if (isTemplate) {
    title = mode === "create" ? "Create New Template" : "Edit Template";
    description = mode === "create"
      ? "Enter details for the template project that all users will see"
      : "Update the template project details";
  }
  
  const submitButtonText = mode === "create" ? "Create Project" : "Save Changes";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isTemplate && <BookOpen className="text-brand-primary" />}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>
            {description}
            {isTemplate && mode === "create" && (
              <p className="mt-2 text-brand-primary">
                Note: Template projects will be visible to all users, but only superadmins can modify them.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter project description (optional)"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className={isTemplate ? "bg-brand-primary hover:bg-brand-primary/90" : ""}
          >
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
