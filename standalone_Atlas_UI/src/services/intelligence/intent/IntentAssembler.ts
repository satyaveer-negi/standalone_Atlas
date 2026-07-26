import { EngineeringIntent } from "./EngineeringIntent";
import { activeIntentTokenizer } from "./IntentTokenizer";
import { activeEngineeringEntityRecognizer } from "./EngineeringEntityRecognizer";
import { activeConstraintExtractor } from "./ConstraintExtractor";
import { activeObjectiveExtractor } from "./ObjectiveExtractor";

export class IntentAssembler {
  public assembleIntent(prompt: string): EngineeringIntent {
    const tokens = activeIntentTokenizer.tokenize(prompt);
    const entities = activeEngineeringEntityRecognizer.recognizeEntities(tokens);
    const constraints = activeConstraintExtractor.extractConstraints(prompt);
    const objectives = activeObjectiveExtractor.extractObjectives(tokens);

    return {
      id: `intent-${Date.now()}`,
      goal: prompt,
      context: "User-defined Intent",
      entities,
      constraints,
      objectives,
      assumptions: ["All constraints are operational bounds."],
      priority: "Medium",
      confidence: 0.95,
      validationStatus: "Draft",
      provenance: "Natural Language Parser",
      createdAt: new Date().toISOString()
    };
  }
}

export const activeIntentAssembler = new IntentAssembler();
