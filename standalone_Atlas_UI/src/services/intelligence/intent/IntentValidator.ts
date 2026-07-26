import { EngineeringIntent } from "./EngineeringIntent";

export class IntentValidator {
  public validate(intent: EngineeringIntent): { valid: boolean; error?: string } {
    if (intent.goal.trim() === "") {
      return { valid: false, error: "[Validator] Intent goal target prompt cannot be empty." };
    }

    // Example checks: conflicting constraints
    const maxVal = intent.constraints.find(c => c.expression.includes(">"));
    const minVal = intent.constraints.find(c => c.expression.includes("<"));
    if (maxVal && minVal && maxVal.limitValue > minVal.limitValue) {
      return { valid: false, error: `[Validator] Contradictory bounds detected: limit value ${maxVal.limitValue} exceeds ${minVal.limitValue}.` };
    }

    return { valid: true };
  }
}

export const activeIntentValidator = new IntentValidator();
