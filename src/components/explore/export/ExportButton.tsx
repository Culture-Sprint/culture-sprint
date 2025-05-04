
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/toast";
import { Story } from "@/types/story";

interface ExportButtonProps {
  stories: Story[];
  exportToCSV: (stories: Story[]) => void;
}

const ExportButton = ({ stories, exportToCSV }: ExportButtonProps) => {
  const { toast } = useToast();

  const handleExportCSV = () => {
    if (stories.length === 0) {
      toast({
        title: "No stories to export",
        description: "Please adjust your filters or add stories first.",
        variant: "destructive"
      });
      return;
    }
    
    exportToCSV(stories);
    
    toast({
      title: "Export successful",
      description: `${stories.length} stories exported to CSV.`,
      variant: "default"
    });
  };

  return (
    <Button 
      variant="outline" 
      className="gap-2" 
      onClick={handleExportCSV}
      disabled={stories.length === 0}
    >
      <FileSpreadsheet className="h-4 w-4" />
      Export to CSV
    </Button>
  );
};

export default ExportButton;
