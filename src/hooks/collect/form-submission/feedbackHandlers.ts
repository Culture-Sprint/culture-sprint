
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useFeedbackHandlers = (isPublic: boolean) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSuccess = () => {
    toast({
      title: "Story submitted",
      description: "Thank you for sharing your story with us!",
    });
    
    // For authenticated users, redirect to explore page
    if (!isPublic) {
      navigate("/explore");
    }
  };
  
  return { handleSuccess };
};
