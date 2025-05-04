
import React from "react";
import { Project } from "@/types/project";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, User, BookOpen } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";

interface ProjectListProps {
  projects: Project[];
  onOpen: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  projectOwners?: Record<string, string>;
  isTemplateOrClone?: (project: Project) => boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onOpen, 
  onEdit, 
  onDelete,
  projectOwners = {},
  isTemplateOrClone = () => false,
}) => {
  const { isSuperUser, isSuperAdmin } = useUserRole();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className={`overflow-hidden ${project.is_template ? 'border-brand-primary border-2' : ''}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl truncate">{project.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Last updated: {new Date(project.updated_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 line-clamp-3 mb-2">
              {project.description || "No description provided"}
            </p>
            
            {/* Template badge moved below the description */}
            {isTemplateOrClone(project) && (
              <Badge className="bg-brand-primary hover:bg-brand-primary/90 flex items-center gap-1 mt-2">
                <BookOpen size={12} />
                {project._clone ? "Template Clone" : "Template"}
              </Badge>
            )}
            
            {isSuperUser() && projectOwners[project.id] && (
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <User size={12} className="mr-1" />
                <span>Owner: {projectOwners[project.id]}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-3 border-t bg-muted/50">
            <Button 
              variant="default" 
              onClick={() => onOpen(project)}
            >
              Open
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(project)}
                disabled={project.is_template && !isSuperAdmin()}
              >
                <Edit size={16} />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500"
                    disabled={project.is_template && !isSuperAdmin()}
                  >
                    <Trash2 size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{project.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(project.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
