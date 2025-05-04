
/**
 * Prepares project context for AI generation
 */
import { Project } from "@/types/project";
import { fetchComprehensiveProjectContext } from "@/utils/project-context/dataFetcher";
import { formatRawContextData } from "@/utils/project-context/formatters/formatRawContextData";
import { getFormattedProjectContext } from "@/utils/project-context/getFormattedProjectContext";
import { clearProjectContextCache } from "@/services/cache/projectContextCache";

/**
 * Type definition for context data
 */
interface ContextData {
  context: string;
  rawData?: any;
}

/**
 * Prepares the project context for AI prompt
 */
export const prepareProjectContext = async (
  project: Project,
  prompt: string
): Promise<ContextData | null> => {
  try {
    if (!project || !project.id) {
      console.error("Invalid project provided for context preparation");
      return null;
    }

    console.log("Preparing context for project:", project.name);
    
    // IMPORTANT: Force refresh the context cache to ensure we have the latest data
    clearProjectContextCache(project.id);
    
    // Use the comprehensive context builder with forced refresh
    const context = await getFormattedProjectContext(
      project.id,
      project.name,
      project.description || undefined,
      true // Force refresh to get the latest data
    );
    
    if (!context || context.includes("Error generating project context")) {
      console.error("Failed to build project context");
      return null;
    }
    
    console.log("Successfully built comprehensive context of length:", context.length);
    console.log("Context preview:", context.substring(0, 300) + "...");
    
    return {
      context,
      rawData: {
        projectName: project.name,
        projectId: project.id,
        contextLength: context.length
      }
    };
  } catch (error) {
    console.error("Error preparing project context:", error);
    return null;
  }
};
