import type { AIService } from "../../../services/AIService";

export class SuggestFixesUseCase {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  execute(ruleId: string, sourceId: string, targetId: string) {
    return this.aiService.generateGroundedFix(ruleId, sourceId, targetId);
  }
}
