import React, { useState } from "react";
import { AIPrompt } from "@/services/aiPromptService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Save, Trash2, X, Loader2 } from "lucide-react";

interface AIPromptEditorProps {
  prompt: AIPrompt;
  onSave: (prompt: AIPrompt) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
  onCancel: () => void;
}

const AIPromptEditor: React.FC<AIPromptEditorProps> = ({
  prompt,
  onSave,
  onDelete,
  onCancel
}) => {
  const [editedPrompt, setEditedPrompt] = useState<AIPrompt>({...prompt});
  const [isNew] = useState(!prompt.id);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPrompt(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    setError(null);
    
    // Validation
    if (!editedPrompt.title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!editedPrompt.content.trim()) {
      setError("Content is required");
      return;
    }
    
    if (!editedPrompt.prompt_key.trim() && isNew) {
      setError("Key is required");
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await onSave(editedPrompt);
      if (!success) {
        setError("Failed to save prompt");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      setIsDeleting(true);
      try {
        const success = await onDelete();
        if (!success) {
          setError("Failed to delete prompt");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <Card>
      <CardHeader className="border-b bg-muted/10">
        <CardTitle>{isNew ? 'Create New Prompt' : 'Edit Prompt'}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="metadata" className="flex-1">Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                name="title"
                value={editedPrompt.title}
                onChange={handleInputChange}
                placeholder="Prompt title"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                <span className="text-xs text-muted-foreground">
                  {editedPrompt.content.length} characters
                </span>
              </div>
              <Textarea
                id="content"
                name="content"
                value={editedPrompt.content}
                onChange={handleInputChange}
                placeholder="Prompt content"
                className="min-h-[250px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use standard prompt templating with {"{placeholders}"} for values that will be replaced at runtime
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={editedPrompt.description || ''}
                onChange={handleInputChange}
                placeholder="Prompt description (optional)"
                className="min-h-[80px]"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="metadata" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt_key" className="text-sm font-medium">Prompt Key</Label>
              <Input
                id="prompt_key"
                name="prompt_key"
                value={editedPrompt.prompt_key}
                onChange={handleInputChange}
                placeholder="unique_key_name"
                disabled={!isNew}
                className={!isNew ? "bg-muted cursor-not-allowed" : ""}
              />
              <p className="text-xs text-muted-foreground">
                Unique identifier used in code to reference this prompt. Cannot be changed after creation.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Input
                id="category"
                name="category"
                value={editedPrompt.category}
                onChange={handleInputChange}
                placeholder="Category"
              />
              <p className="text-xs text-muted-foreground">
                Examples: general, story_questions, slider_questions
              </p>
            </div>
            
            {!isNew && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Version:</span>
                  <span className="text-sm">{editedPrompt.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-sm">{new Date(editedPrompt.updated_at).toLocaleString()}</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-muted/10">
        <Button variant="outline" onClick={onCancel} disabled={isSaving || isDeleting}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        
        <div className="flex gap-2">
          {!isNew && (
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting || isSaving}
            >
              {isDeleting ? "Deleting..." : "Delete"}
              <Trash2 className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isDeleting}
            className="text-white"
          >
            {isSaving ? "Saving..." : "Save"}
            {isSaving ? 
              <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : 
              <Save className="ml-2 h-4 w-4" />
            }
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIPromptEditor;
