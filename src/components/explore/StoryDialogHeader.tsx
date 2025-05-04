
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getFeelingColor, formatDate } from "@/utils/story/formattingUtils";
import { Upload } from "lucide-react";

interface StoryDialogHeaderProps {
  title: string;
  feeling: string;
  isPublic?: boolean;
  isImported?: boolean;
  date: string;
}

const StoryDialogHeader = ({ title, feeling, isPublic, isImported, date }: StoryDialogHeaderProps) => {
  return (
    <DialogHeader>
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <DialogTitle className="text-xl text-narrafirma-900">{title}</DialogTitle>
        <div className="flex gap-2">
          <Badge className={getFeelingColor(feeling)}>
            {feeling || "Unspecified"}
          </Badge>
          
          {isImported ? (
            <Badge variant="outline" className="bg-gray-50 flex items-center gap-1">
              <Upload className="h-3 w-3" />
              Imported
            </Badge>
          ) : (
            isPublic !== undefined && (
              <Badge variant="outline" className="bg-gray-50">
                {isPublic ? "Public" : "In-app"}
              </Badge>
            )
          )}
        </div>
      </div>
      <DialogDescription className="text-right text-sm text-gray-500">
        {formatDate(date)}
      </DialogDescription>
    </DialogHeader>
  );
};

export default StoryDialogHeader;
