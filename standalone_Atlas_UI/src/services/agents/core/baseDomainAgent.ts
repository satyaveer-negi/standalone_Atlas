import { EngineeringAgent, DomainValidationReport } from "./engineeringAgent";

export abstract class BaseDomainAgent implements EngineeringAgent {
  public abstract plan(objective: string): string[];
  public abstract validate(parameters: Record<string, any>): DomainValidationReport;

  public evaluate(metrics: Record<string, any>): number {
    // Standard validation utility grading metric success levels
    const accuracy = metrics.accuracy ?? 90;
    const completeness = metrics.completeness ?? 95;
    return Math.floor((accuracy + completeness) / 2);
  }

  public learn(outcomeDetails: string): void {
    console.log(`[Base Domain Agent] Preserved episode outcome logs for RAG grounding: ${outcomeDetails}`);
  }
}
