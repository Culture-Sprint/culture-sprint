
import { useState, useEffect, useCallback, useMemo } from "react";
import PageLayout from "@/components/layout/PageLayout";
import SearchFilter from "@/components/explore/SearchFilter";
import ExploreHeader from "@/components/explore/ExploreHeader";
import StoriesContent from "@/components/explore/StoriesContent";
import useStories from "@/hooks/useStories";
import { 
  getFeelingColor, 
  formatDate
} from "@/utils/story/formattingUtils";
import { 
  convertStoriesToCSV, 
  downloadCSV
} from "@/utils/story/csvExportUtils";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/toast";

const STORIES_PER_PAGE = 6;

const Explore = () => {
  const { activeProject } = useProject();
  const { stories, isLoading, refetch } = useStories();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "positive" | "neutral" | "negative" | "saved">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedStoryIds, setSavedStoryIds] = useState<Record<string | number, boolean>>({});
  const { toast } = useToast();
  
  // Reset pagination when project changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeProject?.id]);
  
  // Load saved stories from localStorage
  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem('savedStories') || '{}');
    setSavedStoryIds(savedStories);
  }, []);
  
  // Handle toggling save state
  const handleToggleSave = useCallback((storyId: number | string, isSaved: boolean) => {
    setSavedStoryIds(prev => {
      const updated = { ...prev };
      if (isSaved) {
        updated[storyId] = true;
      } else {
        delete updated[storyId];
      }
      
      // Save to localStorage
      localStorage.setItem('savedStories', JSON.stringify(updated));
      return updated;
    });
    
    // If we're on the saved filter and unsaving a story, refresh the filtered list
    if (filter === "saved") {
      setCurrentPage(1);
    }
  }, [filter]);
  
  // Add isSaved property to stories and filter - memoize this operation
  const filteredStories = useMemo(() => {
    const storiesWithSavedState = stories.map(story => ({
      ...story,
      isSaved: !!savedStoryIds[story.id]
    }));
    
    return storiesWithSavedState.filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            story.text.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (filter === "positive") {
        matchesFilter = story.feelingSentiment === "positive";
      } else if (filter === "neutral") {
        matchesFilter = story.feelingSentiment === "neutral";
      } else if (filter === "negative") {
        matchesFilter = story.feelingSentiment === "negative";
      } else if (filter === "saved") {
        matchesFilter = !!story.isSaved;
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [stories, searchTerm, filter, savedStoryIds]);
  
  // Calculate pagination values - memoize
  const { totalPages, paginatedStories } = useMemo(() => {
    const total = Math.ceil(filteredStories.length / STORIES_PER_PAGE);
    const paginated = filteredStories.slice(
      (currentPage - 1) * STORIES_PER_PAGE, 
      currentPage * STORIES_PER_PAGE
    );
    
    return {
      totalPages: total,
      paginatedStories: paginated
    };
  }, [filteredStories, currentPage]);
  
  // Filter change handler
  const handleFilterChange = useCallback((newFilter: "all" | "positive" | "neutral" | "negative" | "saved") => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);
  
  // Search change handler
  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  }, []);
  
  // Import success handler
  const handleImportSuccess = useCallback(() => {
    window.location.reload();
  }, []);
  
  // Story delete handler
  const handleStoryDelete = useCallback(async () => {
    await refetch();
    toast({
      title: "Stories updated",
      description: "The story list has been refreshed after deletion.",
    });
    
    // Adjust the current page if we're on the last page and it becomes empty
    if (paginatedStories.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [refetch, toast, paginatedStories.length, currentPage]);
  
  // CSV export handler
  const exportToCSV = useCallback((stories: typeof filteredStories) => {
    const csvContent = convertStoriesToCSV(stories);
    const fileName = `culture-sprint-stories-${activeProject?.name || 'project'}-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, fileName);
  }, [activeProject?.name]);
  
  return (
    <PageLayout>
      <div className="p-8">
        <ExploreHeader 
          filteredStories={filteredStories}
          onImportSuccess={handleImportSuccess}
          exportToCSV={exportToCSV}
        />
        
        <SearchFilter 
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          view={view}
          setView={setView}
          filter={filter}
          setFilter={handleFilterChange}
        />
        
        <StoriesContent 
          isLoading={isLoading}
          filteredStories={filteredStories}
          paginatedStories={paginatedStories}
          allStoriesEmpty={stories.length === 0}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          view={view}
          projectName={activeProject?.name}
          getFeelingColor={getFeelingColor}
          formatDate={formatDate}
          onStoryDelete={handleStoryDelete}
          onToggleSave={handleToggleSave}
        />
      </div>
    </PageLayout>
  );
};

export default Explore;
