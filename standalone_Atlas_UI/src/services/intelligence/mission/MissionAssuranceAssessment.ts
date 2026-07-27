export interface MissionAssuranceAssessment {
  assessmentId: string;
  successProbability: number;
  objectiveFulfillmentScore: number;
  assuranceConfidence: number;
  maturityLevel: number;
  assessmentDate: string;
  trendScore: number;
  confidenceInterval: string;
  assessmentSource: string;
  contributingEvidenceRefs: string[];
}
