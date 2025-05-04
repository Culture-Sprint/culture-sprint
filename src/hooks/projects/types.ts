
import { Project } from "@/types/project";

// Define project operation result types
export type ProjectOperationResult<T = null> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Define project hook types
export interface ProjectOperations {
  createProject: (name: string, description?: string) => Promise<Project | null>;
  updateProject: (projectId: string, name: string, description?: string) => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<boolean>;
  navigateToProject: (project: Project) => void;
}

export interface ProjectContextType {
  projectName: string;
  projectDescription?: string;
  storyData?: {
    storyCount: number;
    sentiments: {
      positive: number;
      neutral: number;
      negative: number;
    };
    avgImpact: number | string;
    sliderQuestions?: string[];
    hasSliderData?: boolean;
  };
  activityResponses?: Record<string, any>;
  id?: string;
}

export interface ActivityResponse {
  data?: any;
  ar_response?: any;
  [key: string]: any;
}
