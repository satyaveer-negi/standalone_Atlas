export type LearningTrendDirection = "Improving" | "Stable" | "Declining";

export interface KnowledgeExchangeAssessment {
  assessmentId: string;
  evaluationPeriod: string;
  knowledgeReuseRate: number; // percentage
  transferEffectivenessScore: number; // out of 100
  collaborationEfficiency: number; // out of 100
  innovationVelocityIndex: number; // out of 100
  diffusionRate: number; // percentage
  learningTrend: LearningTrendDirection;
  assessmentDate: string;
}
