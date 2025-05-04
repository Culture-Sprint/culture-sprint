
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequestBody {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface OpenAIResponse {
  choices: Array<{
    message: OpenAIMessage;
    finish_reason: string;
  }>;
}

export enum ErrorCode {
  BAD_REQUEST = 'bad_request',
  SERVER_ERROR = 'server_error',
  OPENAI_ERROR = 'openai_error',
  UNKNOWN_ERROR = 'unknown_error',
  INVALID_JSON = 'invalid_json',
  API_KEY_MISSING = 'api_key_missing',
  INVALID_API_KEY = 'invalid_api_key',
  TIMEOUT = 'timeout',
  RATE_LIMIT = 'rate_limit'
}

export interface ErrorDetails {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ApiErrorResponse {
  error: string;
  details?: ErrorDetails;
  errorCode: ErrorCode;
}

export interface RequestData {
  prompt: string;
  projectContext?: string;
  requestType?: 'general' | 'sentimentAnalysis' | 'storyQuestion';
}

export interface GeneralRequest extends RequestData {
  requestType?: 'general';
}

export interface SentimentAnalysisRequest extends RequestData {
  requestType: 'sentimentAnalysis';
  emotion: string;
}

export interface StoryQuestionRequest extends RequestData {
  requestType: 'storyQuestion';
  prompt?: string;
}
