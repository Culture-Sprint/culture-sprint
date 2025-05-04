import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WordCloudProps {
  stories: any[];
  isLoading: boolean;
}

const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", 
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "did", "do", 
  "does", "doing", "don", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", 
  "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "i", "if", "in", "into", 
  "is", "it", "its", "itself", "just", "me", "more", "most", "my", "myself", "no", "nor", "not", "now", "of", 
  "off", "on", "once", "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own", "s", "same", 
  "she", "should", "so", "some", "such", "t", "than", "that", "the", "their", "theirs", "them", "themselves", 
  "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", 
  "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", 
  "you", "your", "yours", "yourself", "yourselves", "also", "like"
]);

const MIN_WORD_LENGTH = 3;
const MAX_WORDS = 25;

const WordCloudSection: React.FC<WordCloudProps> = ({ stories, isLoading }) => {
  const wordFrequencies = useMemo(() => {
    if (isLoading || stories.length === 0) return [];
    
    const wordCounts = new Map<string, number>();
    
    stories.forEach(story => {
      if (!story.text) return;
      
      const words = story.text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(/\s+/);
      
      words.forEach(word => {
        if (word.length >= MIN_WORD_LENGTH && !STOPWORDS.has(word)) {
          wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }
      });
    });
    
    return Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_WORDS)
      .map(([word, count]) => ({ text: word, value: count }));
  }, [stories, isLoading]);
  
  const colorClasses = [
    "text-primary",            // Primary deep purple
    "text-secondary",          // Secondary bright pink
    "text-culturesprint-400",  // Medium purple
    "text-culturesprint-500",  // Darker purple
    "text-culturesprint-600",  // Primary deep purple
    "text-accent",             // Light purple
    "text-culturesprint-300",  // Light purple
  ];
  
  const getWordStyle = (count: number) => {
    const max = wordFrequencies.length > 0 ? wordFrequencies[0].value : 1;
    const min = wordFrequencies.length > 0 ? 
      wordFrequencies[wordFrequencies.length - 1].value : 1;
    
    const range = max - min || 1;
    const normalized = ((count - min) / range) * 4 + 1;
    
    const fontSize = Math.max(Math.round(normalized * 4) + 8, 12);
    
    const opacity = 0.75 + (normalized / 5) * 0.25;
    
    const colorIndex = Math.floor(normalized * 2) % colorClasses.length;
    
    return {
      fontSize: `${fontSize}px`,
      opacity,
      className: colorClasses[colorIndex],
      fontWeight: fontSize > 20 ? "bold" : "normal",
      transform: `rotate(${Math.random() * 4 - 2}deg)`
    };
  };
  
  if (isLoading) {
    return null;
  }
  
  return (
    <Card className="col-span-1 overflow-hidden h-full shadow-md border-opacity-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
        <div>
          <CardTitle className="text-primary">Word Cloud</CardTitle>
          <CardDescription>
            Top 25 most common words in collected stories
          </CardDescription>
        </div>
        <Hash className="h-4 w-4 text-primary opacity-80" />
      </CardHeader>
      <CardContent className="p-2 bg-gradient-to-b from-white to-culturesprint-50 rounded-b-md flex-grow flex flex-col pt-8">
        {wordFrequencies.length === 0 ? (
          <div className="text-center py-4 text-gray-500 flex-grow flex items-center justify-center">
            No story text available to generate a word cloud
          </div>
        ) : (
          <TooltipProvider>
            <div className="flex flex-wrap justify-center items-center gap-2 p-3 animate-fade-in flex-grow">
              {wordFrequencies.map(({ text, value }) => {
                const style = getWordStyle(value);
                return (
                  <Tooltip key={text}>
                    <TooltipTrigger asChild>
                      <span
                        className={cn(
                          "px-1 py-0.5 cursor-pointer transition-all duration-300",
                          "hover:scale-110 hover:drop-shadow-md",
                          style.className
                        )}
                        style={{ 
                          fontSize: style.fontSize, 
                          opacity: style.opacity,
                          fontWeight: style.fontWeight,
                          transform: style.transform
                        }}
                      >
                        {text}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-primary text-primary-foreground">
                      {text}: appears {value} time{value !== 1 ? 's' : ''}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
};

export default WordCloudSection;
