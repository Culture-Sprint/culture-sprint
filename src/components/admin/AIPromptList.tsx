
import React from "react";
import { AIPrompt } from "@/services/aiPromptService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AIPromptListProps {
  prompts: AIPrompt[];
  selectedPromptId: string | null;
  onSelectPrompt: (prompt: AIPrompt) => void;
}

const AIPromptList: React.FC<AIPromptListProps> = ({ 
  prompts, 
  selectedPromptId, 
  onSelectPrompt 
}) => {
  // Generate color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'story_questions':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'slider_questions':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'general':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <ScrollArea className="h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4">
                No prompts found
              </TableCell>
            </TableRow>
          ) : (
            prompts.map((prompt) => (
              <TableRow 
                key={prompt.id} 
                className={`cursor-pointer hover:bg-muted/50 ${selectedPromptId === prompt.id ? 'bg-primary/10' : ''}`}
                onClick={() => onSelectPrompt(prompt)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{prompt.title}</div>
                    <div className="text-xs text-muted-foreground">{prompt.prompt_key}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(prompt.category)}`}
                  >
                    {prompt.category}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AIPromptList;
