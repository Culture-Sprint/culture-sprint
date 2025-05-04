
import { DesignPhase } from "./types/designTypes";
import { contextPhase } from "./phases/contextPhase";
import { definePhase } from "./phases/definePhase";
import { designPhase } from "./phases/designPhase";
import { buildPhase } from "./phases/buildPhase";

// Export the component interfaces for use in other files
export type { DesignActivity, DesignStep, DesignPhase } from "./types/designTypes";

// Combine all phases into a single array
export const designPhases: DesignPhase[] = [
  contextPhase,
  definePhase,
  designPhase,
  buildPhase
];
