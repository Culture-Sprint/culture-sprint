import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
interface ImportButtonUIProps {
  onClick: () => void;
  isLoading: boolean;
}
const ImportButtonUI = ({
  onClick,
  isLoading
}: ImportButtonUIProps) => {
  return <Button variant="outline" onClick={onClick} disabled={isLoading} className="gap-2 border-violet-900">
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
      Import CSV
    </Button>;
};
export default ImportButtonUI;