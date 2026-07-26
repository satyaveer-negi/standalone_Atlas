import { EngineeringIntent } from "../intent/EngineeringIntent";

export interface IntentExplanation {
  intentId: string;
  entitiesRecognized: string[];
  assumptionsMade: string[];
  confidenceScore: number;
}

export class IntentExplanationEngine {
  public generateExplanation(intent: EngineeringIntent): IntentExplanation {
    return {
      intentId: intent.id,
      entitiesRecognized: intent.entities,
      assumptionsMade: [
        "Matched panel criteria against operational substation constraints.",
        "Assuming optimal battery charging parameters remain within Safety thresholds."
      ],
      confidenceScore: intent.confidence
    };
  }
}

export const activeIntentExplanationEngine = new IntentExplanationEngine();
