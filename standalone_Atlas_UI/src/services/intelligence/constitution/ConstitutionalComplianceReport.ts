import { ConstitutionalPillar } from "./EngineeringConstitution";

export interface ConstitutionalComplianceReport {
  reportId: string;
  overallScore: number; // 0-100
  pillarScores: Record<ConstitutionalPillar, number>;
  totalViolationsActive: number;
  totalExceptionsActive: number;
  timestamp: string;
}
