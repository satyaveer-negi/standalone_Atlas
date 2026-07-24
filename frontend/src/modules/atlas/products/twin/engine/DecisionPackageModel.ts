export interface DecisionPackage {
  packageId: string;
  recommendedAction: string;
  alternatives: string[];
  evidence: string[];
  confidence: number; // 0-100
  riskScore: number; // 0-1
  approvalRequirements: string[];
  affectedEntities: string[];
  estimatedImpact: string;
  generatedBy: string;
  generatedAt: number;
}
