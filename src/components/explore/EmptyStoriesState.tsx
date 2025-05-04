
import { Button } from "@/components/ui/button";

interface EmptyStoriesStateProps {
  allStoriesEmpty: boolean;
  projectName?: string;
}

const EmptyStoriesState = ({ allStoriesEmpty, projectName }: EmptyStoriesStateProps) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border">
      <h3 className="text-xl font-medium text-gray-700 mb-2">No stories found</h3>
      <p className="text-gray-500 mb-4">
        {allStoriesEmpty 
          ? `There are no stories in ${projectName ? `the "${projectName}" project` : "this project"} yet.` 
          : "Try adjusting your search or filters."}
      </p>
      <Button asChild>
        <a href="/collect">Share a story</a>
      </Button>
    </div>
  );
};

export default EmptyStoriesState;
