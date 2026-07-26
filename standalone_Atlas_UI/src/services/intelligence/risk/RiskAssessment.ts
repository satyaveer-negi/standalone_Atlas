export interface RiskAssessment {
  assessmentId: string;
  likelihood: number;
  consequence: number;
  exposure: number;
  detectability: number;
  overallRiskRating: number;
  assessmentMethod: string;
  assessmentDate: string;
}
