
/**
 * Centralized type definitions for chat-related functionality
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatDebugInfo {
  prompt: string | null;
  context: string | null;
  response: string | null;
}

export type AssistantMode = 'general' | 'storyQuestion' | 'improve';

export interface AIAssistantRequest {
  prompt: string;
  projectContext?: string;
  mode?: AssistantMode;
}

export interface AIAssistantResponse {
  response: string | null;
  error: string | null;
  errorCode: string | null;
}
