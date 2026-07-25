export interface ValidationFinding {
  parameter: string;
  status: "PASSED" | "WARNING" | "FAILED";
  details: string;
}

export interface DomainValidationReport {
  overallPassed: boolean;
  findings: ValidationFinding[];
}

export interface EngineeringAgent {
  plan(objective: string): string[];
  validate(parameters: Record<string, any>): DomainValidationReport;
  evaluate(metrics: Record<string, any>): number;
  learn(outcomeDetails: string): void;
}
