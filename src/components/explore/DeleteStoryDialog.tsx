
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { AlertCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/toast";
import { deleteStory } from "@/services/story";
import { useProject } from "@/contexts/ProjectContext";
import { useUserRole } from "@/hooks/useUserRole";

interface DeleteStoryDialogProps {
  storyId: string | number;
  storyTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

const DeleteStoryDialog = ({ storyId, storyTitle, isOpen, onClose, onDeleteSuccess }: DeleteStoryDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { activeProject } = useProject();
  const { isSuperAdmin } = useUserRole();
  
  // Check if this is a template project and user is not a superadmin
  const isTemplateProject = activeProject?.is_template || activeProject?._clone;
  const canDeleteStory = !(isTemplateProject && !isSuperAdmin());

  const handleDelete = async () => {
    if (isDeleting || !canDeleteStory) return; // Prevent deletion if user doesn't have permission
    
    setIsDeleting(true);
    try {
      console.log("Attempting to delete story with ID:", storyId);
      const success = await deleteStory(storyId);
      
      if (success) {
        console.log("Story successfully deleted:", storyId);
        toast({
          title: "Story deleted",
          description: "The story has been permanently removed.",
        });
        // Call onDeleteSuccess to refresh the story list
        onDeleteSuccess();
        // Close the dialog on success
        onClose();
      } else {
        console.error("Failed to delete story:", storyId);
        toast({
          title: "Error",
          description: "Failed to delete the story. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {canDeleteStory ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <Lock className="h-5 w-5 text-amber-500" />
            )}
            {canDeleteStory ? "Delete Story" : "Cannot Delete Story"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canDeleteStory ? (
              <>
                Are you sure you want to delete <span className="font-medium">"{storyTitle}"</span>? This action 
                cannot be undone and all associated data will be permanently removed.
              </>
            ) : (
              <>
                Stories in template projects can only be deleted by administrators. 
                This restriction helps maintain the integrity of template data for all users.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          {canDeleteStory && (
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStoryDialog;
