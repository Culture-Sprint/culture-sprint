
import React, { useState } from "react";
import { useAIPrompts } from "@/hooks/useAIPrompts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIPrompt } from "@/services/aiPromptService";
import AIPromptList from "./AIPromptList";
import AIPromptEditor from "./AIPromptEditor";
import { Search, Plus, Loader2 } from "lucide-react";

const AIPromptManager = () => {
  const {
    prompts,
    loading,
    categories,
    selectedPrompt,
    setSelectedPrompt,
    updatePrompt,
    createPrompt,
    deletePrompt
  } = useAIPrompts();
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter prompts based on category and search term
  const filteredPrompts = prompts
    .filter(prompt => !activeCategory || prompt.category === activeCategory)
    .filter(prompt => 
      searchTerm === "" || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.prompt_key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const handleSavePrompt = async (prompt: AIPrompt) => {
    return await updatePrompt(prompt);
  };
  
  const handleCreatePrompt = async (prompt: Omit<AIPrompt, 'id' | 'created_at' | 'updated_at' | 'version' | 'created_by'>) => {
    return await createPrompt(prompt);
  };
  
  const handleDeletePrompt = async (id: string) => {
    return await deletePrompt(id);
  };
  
  const handleNewPrompt = () => {
    setSelectedPrompt({
      id: '',
      prompt_key: '',
      title: '',
      content: '',
      description: '',
      category: categories[0] || 'general',
      created_at: '',
      updated_at: '',
      created_by: null,
      version: 1
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={handleNewPrompt}>
          <Plus className="mr-1 h-4 w-4" />
          New Prompt
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="p-3 bg-muted/20 border-b">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full mb-0">
                    <TabsTrigger 
                      value="all" 
                      onClick={() => setActiveCategory(null)}
                      className="flex-1"
                    >
                      All
                    </TabsTrigger>
                    {categories.map(category => (
                      <TabsTrigger 
                        key={category} 
                        value={category}
                        onClick={() => setActiveCategory(category)}
                        className="flex-1"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="h-[500px]">
                <AIPromptList 
                  prompts={filteredPrompts}
                  selectedPromptId={selectedPrompt?.id || null}
                  onSelectPrompt={(prompt) => setSelectedPrompt(prompt)}
                />
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {selectedPrompt ? (
              <AIPromptEditor
                prompt={selectedPrompt}
                onSave={handleSavePrompt}
                onDelete={() => handleDeletePrompt(selectedPrompt.id)}
                onCancel={() => setSelectedPrompt(null)}
              />
            ) : (
              <Card className="h-full">
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted/20">
                  <div className="mb-4 text-muted-foreground">
                    <div className="mb-2 text-3xl">👆</div>
                    <p>Select a prompt from the list to edit or click "New Prompt" to create one</p>
                  </div>
                  <Button 
                    className="mt-4"
                    onClick={handleNewPrompt}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Create New Prompt
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPromptManager;
