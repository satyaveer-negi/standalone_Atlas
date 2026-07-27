export type BenefitRealizationStatus = 
  | "OnTrack" 
  | "Slipped" 
  | "Exceeded" 
  | "NotStarted";

export interface BenefitRealizationPlan {
  planId: string;
  investmentPlanId: string;
  targetMetricName: string;
  baselineValue: number;
  expectedValue: number;
  realizedValue: number;
  realizedDate: string;
  variance: number;
  benefitOwner: string;
  verificationEvidence: string[];
  realizationStatus: BenefitRealizationStatus;
}
