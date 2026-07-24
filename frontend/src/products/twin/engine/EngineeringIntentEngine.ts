import { IntentParser } from "./IntentParser";
import { IntentPlanner } from "./IntentPlanner";
import { IntentValidator } from "./IntentValidator";
import { IntentExecutor, type IntentPipelineResult } from "./IntentExecutor";

export class EngineeringIntentEngine {
  private parser = new IntentParser();
  private planner = new IntentPlanner();
  private validator = new IntentValidator();
  private executor = new IntentExecutor();

  processIntent(rawIntent: string): IntentPipelineResult {
    const parsed = this.parser.parse(rawIntent);
    const plan = this.planner.createPlan(parsed);
    const isValid = this.validator.validate(plan);

    if (!isValid) {
      throw new Error("Intent validation failed: Cost or latency boundary invalid.");
    }

    return this.executor.execute(plan);
  }
}
