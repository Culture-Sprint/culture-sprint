import { useProject } from "@/contexts/ProjectContext";
import ImportExportActions from "./ImportExportActions";
import { Story } from "@/types/story";
interface ExploreHeaderProps {
  filteredStories: Story[];
  onImportSuccess: () => void;
  exportToCSV: (stories: Story[]) => void;
}
const ExploreHeader = ({
  filteredStories,
  onImportSuccess,
  exportToCSV
}: ExploreHeaderProps) => {
  const {
    activeProject
  } = useProject();
  return <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <h1 className="font-bold text-primary text-4xl">Explore Stories</h1>
          {activeProject && <p className="text-sm text-gray-500 mt-1">
              Project: {activeProject.name}
            </p>}
        </div>
        <ImportExportActions filteredStories={filteredStories} onImportSuccess={onImportSuccess} exportToCSV={exportToCSV} />
      </div>
      
      <p className="text-gray-600 max-w-3xl">
        Browse through collected stories to discover patterns, insights, and shared experiences.
        Use the search and filters to find stories relevant to your interests.
      </p>
    </div>;
};
export default ExploreHeader;