export type InvestmentPriorityLevel = "Low" | "Medium" | "High" | "Critical";

export interface AdaptiveCapabilityPortfolio {
  portfolioId: string;
  capabilityName: string;
  currentMaturity: number; // 1 to 5
  targetMaturity: number; // 1 to 5
  adoptionReadinessScore: number; // out of 100
  investmentPriority: InvestmentPriorityLevel;
  adaptationCost: number;
  governanceWaiverApproved: boolean;
  lastReviewedDate: string;
}
