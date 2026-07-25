export interface RiskAssessment {
  overallScore: number;
  complexityRisk: number;
  dependencyRisk: number;
  executionRisk: number;
  confidence: number;
  explanation: string;
}
