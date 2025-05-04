import React from 'react';
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { DownloadIcon, UploadIcon } from "lucide-react";
import ImportButton from "./import/ImportButton";
interface ImportExportActionsProps {
  filteredStories: any[];
  onImportSuccess: () => void;
  exportToCSV: (stories: any[]) => void;
}
const ImportExportActions: React.FC<ImportExportActionsProps> = ({
  filteredStories,
  onImportSuccess,
  exportToCSV
}) => {
  const handleExport = () => {
    exportToCSV(filteredStories);
  };
  return <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-1">
        <ImportButton onImportSuccess={onImportSuccess} onSuccess={onImportSuccess} />
        <InfoTooltip contentKey="explore-import-csv" size={16} />
      </div>
      
      <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredStories.length === 0} className="gap-2 border-violet-900 py-[18px]">
        <DownloadIcon className="h-4 w-4 mr-1" />
        Export CSV
      </Button>
    </div>;
};
export default ImportExportActions;