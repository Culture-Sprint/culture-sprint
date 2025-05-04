
import React from "react";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface EmbedCodeDialogProps {
  code: string;
  title: string;
  description: string;
  trigger: React.ReactNode;
}

const EmbedCodeDialog: React.FC<EmbedCodeDialogProps> = ({
  code,
  title,
  description,
  trigger
}) => {
  const { toast } = useToast();
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Embed code copied",
      description: "The code has been copied to your clipboard"
    });
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 overflow-hidden">
          <pre className="bg-gray-50 p-4 rounded-md text-sm font-mono overflow-x-auto border max-h-[300px]">
            {code}
          </pre>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={handleCopyCode}
          >
            <Code className="h-4 w-4" />
            Copy Code
          </Button>
          
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbedCodeDialog;
