
/**
 * Calculates the predominant sentiment and its percentage based on story counts.
 */
export const calculatePredominantSentiment = (
  totalStories: number,
  positiveStories: number,
  neutralStories: number,
  negativeStories: number
) => {
  const predominantSentiment = positiveStories > negativeStories 
    ? "Positive" 
    : negativeStories > positiveStories 
      ? "Negative" 
      : "Neutral";
  
  const predominantCount = positiveStories > negativeStories 
    ? positiveStories 
    : negativeStories > positiveStories 
      ? negativeStories 
      : neutralStories;
  
  const predominantPercentage = totalStories > 0 
    ? Math.round((predominantCount / totalStories) * 100) 
    : 0;
  
  const sentimentBadgeClass = positiveStories > negativeStories 
    ? "bg-green-100 text-green-800" 
    : negativeStories > positiveStories 
      ? "bg-red-100 text-red-800" 
      : "bg-blue-100 text-blue-800";

  return {
    predominantSentiment,
    predominantPercentage,
    sentimentBadgeClass
  };
};
