export interface EnterpriseStateAssessment {
  assessmentId: string;
  evaluationPeriod: string;
  constitutionalComplianceScore: number; // out of 100
  strategicAlignmentScore: number; // out of 100
  coherenceIndex: number; // out of 100
  operationalHealthScore: number; // out of 100
  decisionConsistencyScore: number; // out of 100
  assessmentDate: string;
}
