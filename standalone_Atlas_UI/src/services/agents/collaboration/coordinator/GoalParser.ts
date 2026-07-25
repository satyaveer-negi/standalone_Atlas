import { ExecutionContext } from "./ExecutionContext";
import { activeCollabEventBus } from "../events/EventBus";

export interface ParsedSubGoal {
  id: string;
  objective: string;
  capabilityRequired: string;
  inputs: string[];
  outputs: string[];
}

export class GoalParser {
  public parseGoal(context: ExecutionContext): ParsedSubGoal[] {
    activeCollabEventBus.publish("GoalReceived", { prompt: context.goalPrompt });

    const goals: ParsedSubGoal[] = [];

    // Simple heuristic parser for multi-step prompts
    const promptLower = context.goalPrompt.toLowerCase();

    if (promptLower.includes("cfd") || promptLower.includes("mesh")) {
      goals.push({
        id: "goal-cfd",
        objective: "Perform CFD Mesh Orthogonality diagnostic audit check",
        capabilityRequired: "cfdAudit",
        inputs: [],
        outputs: ["meshDiagnostics"]
      });
    }

    if (promptLower.includes("math") || promptLower.includes("matrix") || promptLower.includes("compute")) {
      goals.push({
        id: "goal-math",
        objective: "Execute generic engineering math matrix transformations",
        capabilityRequired: "solveThermal", // Maps to structural or math capability plugin
        inputs: ["meshDiagnostics"],
        outputs: ["matrixResult"]
      });
    }

    // Default fallback
    if (goals.length === 0) {
      goals.push({
        id: "goal-generic",
        objective: `Analyze objective: "${context.goalPrompt}"`,
        capabilityRequired: "cfdAudit",
        inputs: [],
        outputs: ["analysisOutput"]
      });
    }

    activeCollabEventBus.publish("GoalParsed", { subgoals: goals.map(g => g.objective) });
    return goals;
  }
}
