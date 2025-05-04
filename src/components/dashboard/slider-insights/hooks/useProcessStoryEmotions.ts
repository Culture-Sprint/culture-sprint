
import { useState, useEffect, useRef } from "react";
import { Story } from "@/types/story";
import { categorizeEmotion } from "@/utils/sentimentAnalysis";
import { determineEmotionLocally } from "./utils/emotionUtils";

/**
 * Custom hook to process story emotions for sentiment analysis with efficient batching
 */
export function useProcessStoryEmotions(stories: Story[], colorByEmotions: boolean) {
  const [processedStories, setProcessedStories] = useState<Record<string, "positive" | "negative" | "neutral">>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const processedStoriesRef = useRef<Set<string>>(new Set());
  const processingInProgressRef = useRef(false);
  const processingQueueRef = useRef<string[]>([]);
  const batchSizeRef = useRef(5); // Process emotions in smaller batches
  
  // Process stories' feelings for sentiment analysis - optimized with batching
  useEffect(() => {
    if (!shouldProcessEmotions(colorByEmotions)) {
      setIsProcessing(false);
      return;
    }
    
    // Reset processing complete when toggling on
    if (colorByEmotions) {
      setProcessingComplete(false);
    }
    
    initializeProcessingQueue(stories, processedStoriesRef, processingQueueRef);
    
    if (processingQueueRef.current.length > 0) {
      setIsProcessing(true);
      processNextBatch();
    } else {
      // If there are no unprocessed stories but we have processed some before,
      // mark as complete immediately
      if (processedStoriesRef.current.size > 0) {
        setProcessingComplete(true);
      }
      setIsProcessing(false);
    }
    
    return () => {
      // Clean up - if component unmounts during processing
      processingInProgressRef.current = false;
    };
  }, [stories, colorByEmotions]); // Keep dependencies minimal
  
  /**
   * Determines if emotion processing should run
   */
  const shouldProcessEmotions = (colorByEmotions: boolean): boolean => {
    return colorByEmotions;
  };
  
  /**
   * Processes the next batch of stories from the queue
   */
  const processNextBatch = async () => {
    // Skip if already processing or queue is empty
    if (processingInProgressRef.current || processingQueueRef.current.length === 0) {
      if (processingQueueRef.current.length === 0) {
        // Queue is empty - all processing is complete
        setIsProcessing(false);
        setProcessingComplete(true);
      }
      return;
    }
    
    // Set flag to prevent concurrent processing
    processingInProgressRef.current = true;
    setIsProcessing(true);
    
    const currentBatch = getNextBatch(processingQueueRef, batchSizeRef.current);
    console.log(`Processing emotions batch of ${currentBatch.length} stories`);
    
    // Process the current batch
    const batchEmotions = await processBatch(currentBatch, stories);
    
    // Update the processed stories state (only if there are new emotions to add)
    if (Object.keys(batchEmotions).length > 0) {
      setProcessedStories(prev => ({
        ...prev,
        ...batchEmotions
      }));
    }
    
    // Clear processing flag
    processingInProgressRef.current = false;
    
    // If there are more stories to process, schedule the next batch
    if (processingQueueRef.current.length > 0) {
      setTimeout(() => processNextBatch(), 10); // Small delay between batches
    } else {
      // No more stories to process
      setIsProcessing(false);
      setProcessingComplete(true);
    }
  };
  
  return {
    processedStories,
    isProcessing,
    processingComplete
  };
}

/**
 * Initializes the processing queue with unprocessed stories
 */
function initializeProcessingQueue(
  stories: Story[],
  processedStoriesRef: React.MutableRefObject<Set<string>>,
  processingQueueRef: React.MutableRefObject<string[]>
) {
  // Find stories that haven't been processed yet
  const unprocessedStoryIds = stories
    .filter(story => story.feeling && !processedStoriesRef.current.has(String(story.id)))
    .map(story => {
      // Mark this story as processed to avoid reprocessing
      const storyId = String(story.id);
      processedStoriesRef.current.add(storyId);
      return storyId;
    });
  
  // Add unprocessed stories to the queue
  if (unprocessedStoryIds.length > 0) {
    processingQueueRef.current = [...processingQueueRef.current, ...unprocessedStoryIds];
  }
}

/**
 * Gets the next batch of stories to process from the queue
 */
function getNextBatch(
  processingQueueRef: React.MutableRefObject<string[]>,
  batchSize: number
): string[] {
  const currentBatch = processingQueueRef.current.slice(0, batchSize);
  
  // Remove the current batch from the queue
  processingQueueRef.current = processingQueueRef.current.slice(batchSize);
  
  return currentBatch;
}

/**
 * Processes a batch of stories to determine their emotional sentiment
 */
async function processBatch(
  storyIds: string[],
  stories: Story[]
): Promise<Record<string, "positive" | "negative" | "neutral">> {
  const storyEmotions: Record<string, "positive" | "negative" | "neutral"> = {};
  
  // Process each story's feeling in the current batch
  for (const storyId of storyIds) {
    const story = stories.find(s => String(s.id) === storyId);
    if (story?.feeling) {
      storyEmotions[storyId] = await processStoryEmotion(story.feeling, storyId);
    }
  }
  
  return storyEmotions;
}

/**
 * Processes a single story's emotion to determine its sentiment
 */
async function processStoryEmotion(
  feeling: string,
  storyId: string
): Promise<"positive" | "negative" | "neutral"> {
  // First try to determine sentiment locally based on common terms
  const localEmotion = determineEmotionLocally(feeling);
  
  if (localEmotion !== "unknown") {
    return localEmotion;
  }
  
  // If we can't determine sentiment locally, use the categorizeEmotion utility
  try {
    return await categorizeEmotion(feeling);
  } catch (error) {
    console.error(`Error categorizing emotion for story ${storyId}:`, error);
    return "neutral"; // Default to neutral on error
  }
}
