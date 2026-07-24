export interface ActionableRecommendation {
  id: string;
  title: string;
  confidencePercent: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  affectedEntities: string[];
  supportingEvidence: string;
  suggestedAction: string;
}

export class RecommendationEngine {
  generateRecommendations(): ActionableRecommendation[] {
    return [
      {
        id: "rec-1",
        title: "Sync Studio Design with Undocumented Redis Tier in Repo",
        confidencePercent: 96,
        priority: "HIGH",
        affectedEntities: ["TaskViewSet REST", "Redis Cache Tier"],
        supportingEvidence: "Correlation Engine found 0.88 causation between unmodeled Redis calls and Staging deployment crashes.",
        suggestedAction: "Run 'Add missing service' in Living Architecture panel to update Studio design model.",
      },
      {
        id: "rec-2",
        title: "Add Secondary Reviewer to PR Approval DAG Workflows",
        confidencePercent: 91,
        priority: "MEDIUM",
        affectedEntities: ["Pull Request Review Workflow", "Alex Dev (Lead)"],
        supportingEvidence: "Approval bottleneck analysis shows single reviewer gate delays deployment lead time by 14 minutes per PR.",
        suggestedAction: "Update Workflow Definition to add Sarah Architect as concurrent reviewer.",
      },
    ];
  }
}
