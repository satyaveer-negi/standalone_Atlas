export type ValueTrend = "Improving" | "Stable" | "Declining";

export interface PortfolioValueAssessment {
  assessmentId: string;
  portfolioId: string;
  cumulativeBenefits: number;
  cumulativeCosts: number;
  benefitCostRatio: number;
  strategicScore: number;
  sustainabilityIndex: number;
  valueTrend: ValueTrend;
  assessmentDate: string;
}
