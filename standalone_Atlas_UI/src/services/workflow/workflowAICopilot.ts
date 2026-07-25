import { WorkflowPackage } from "./workflowRepository";
import { KnowledgeRetriever } from "./ai/agents/knowledgeRetriever";
import { WorkflowGenerator } from "./ai/agents/workflowGenerator";
import { RiskAnalyzer } from "./ai/agents/riskAnalyzer";
import { ReviewerMatcher } from "./ai/agents/reviewerMatcher";
import { QualityAdvisor } from "./ai/agents/qualityAdvisor";
import { RiskAssessment } from "./ai/models/riskAssessment";
import { ReviewerProfile } from "./ai/models/reviewerProfile";
import { WorkflowSuggestion } from "./ai/models/workflowSuggestion";

export type { RiskAssessment, ReviewerProfile, WorkflowSuggestion };

export interface AICopilotResult {
  generatedPackage: WorkflowPackage;
  riskAssessment: RiskAssessment;
  suggestedReviewers: ReviewerProfile[];
  suggestions: WorkflowSuggestion[];
  retrievedContext: string;
}

// 🧠 PUBLIC FACADE COORDINATOR FOR PLATFORM PLUGINS
export class AICoordinator {
  private retriever = new KnowledgeRetriever();
  private generator = new WorkflowGenerator();
  private analyzer = new RiskAnalyzer();
  private matcher = new ReviewerMatcher();
  private advisor = new QualityAdvisor();

  public generateWorkflowFromPrompt(prompt: string): AICopilotResult {
    const retrievedContext = this.retriever.retrieveSimilarTemplates(prompt);
    const generatedPackage = this.generator.generate(prompt);
    const riskAssessment = this.analyzer.analyze(prompt);
    const suggestedReviewers = this.matcher.match(prompt);
    const suggestions = this.advisor.advise(prompt);

    return {
      generatedPackage,
      riskAssessment,
      suggestedReviewers,
      suggestions,
      retrievedContext
    };
  }
}

export const activeAICoordinator = new AICoordinator();
