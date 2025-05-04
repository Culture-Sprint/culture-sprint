
import { Story } from "@/types/story";

export interface SliderQuestion {
  id: number;
  question_text: string;
  left_label?: string;
  right_label?: string;
  responses: number[];
  average: number;
  stories?: { id: string; feeling: string; value: number }[];
}

export interface HistogramBin {
  label: string;
  count: number;
  range: [number, number];
  positive: number;
  negative: number;
  neutral: number;
}

/**
 * Creates empty histogram bins (0-10, 11-20, etc.)
 */
export function createHistogramBins(): HistogramBin[] {
  return Array(10).fill(0).map((_, i) => ({
    label: `${i*10 + 1}-${(i+1)*10}`,
    count: 0,
    range: [i*10 + 1, (i+1)*10] as [number, number],
    positive: 0,
    negative: 0,
    neutral: 0
  }));
}

/**
 * Checks if a story passes the applied filters
 */
function storyPassesFilters(
  storyId: string,
  stories: Story[],
  filters: Record<string, Set<string>>
): boolean {
  if (!hasActiveFilters(filters)) {
    return true;
  }
  
  const storyObject = stories.find(s => String(s.id) === storyId);
  if (!storyObject) {
    return false;
  }
  
  // Check if this story passes all active filters
  for (const [filterId, selectedChoices] of Object.entries(filters)) {
    if (selectedChoices.size === 0) continue; // Skip if no choices selected for this filter
    
    const response = storyObject.participantResponses?.find(r => r.question_id === filterId);
    if (!response || !selectedChoices.has(response.response)) {
      // This story doesn't match a filter criteria
      return false;
    }
  }
  
  return true;
}

/**
 * Determines if there are any active filters applied
 */
function hasActiveFilters(filters: Record<string, Set<string>>): boolean {
  return Object.values(filters).some(set => set.size > 0);
}

/**
 * Updates the bin counters based on story data and its sentiment
 */
function updateBinCounters(
  bins: HistogramBin[],
  value: number,
  sentiment: "positive" | "negative" | "neutral"
): void {
  const binIndex = Math.min(Math.floor(value / 10), 9);
  bins[binIndex].count++;
  
  if (sentiment === "positive") {
    bins[binIndex].positive++;
  } else if (sentiment === "negative") {
    bins[binIndex].negative++;
  } else {
    bins[binIndex].neutral++;
  }
}

/**
 * Prepares histogram data for the selected question
 * Optimized to use cached emotion data and minimize processing
 */
export function prepareHistogramData(
  question: SliderQuestion, 
  processedStories: Record<string, "positive" | "negative" | "neutral">,
  filters: Record<string, Set<string>> = {},
  stories: Story[] = []
): HistogramBin[] {
  // Create empty bins for the histogram
  const bins = createHistogramBins();
  
  // Process each story response
  question.stories?.forEach((storyData) => {
    if (typeof storyData.value !== 'number') {
      return;
    }
    
    // Check if story passes filters
    if (!storyPassesFilters(storyData.id, stories, filters)) {
      return;
    }
    
    // Use the pre-processed sentiment if available, default to neutral
    const sentiment = processedStories[storyData.id] || "neutral";
    
    // Update bin counters based on story data
    updateBinCounters(bins, storyData.value, sentiment);
  });
  
  return bins;
}
