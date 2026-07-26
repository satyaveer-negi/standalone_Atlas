import { EngineeringExperience } from "./EngineeringExperience";
import { activePatternExtractor, ExtractedPattern } from "./PatternExtractor";
import { activeExperienceIndexer } from "./ExperienceIndexer";
import { activeDecisionHistory } from "./DecisionHistory";
import { activeRecommendationLearner } from "./RecommendationLearner";

export class EngineeringMemory {
  private activeExperiences: EngineeringExperience[] = [];
  private activePatterns: ExtractedPattern[] = [];

  public captureExperience(exp: EngineeringExperience): void {
    this.activeExperiences.push(exp);
    
    // Extracted pattern
    const patterns = activePatternExtractor.extractPatterns(exp);
    this.activePatterns.push(...patterns);

    // Index experience
    activeExperienceIndexer.indexExperience(exp);

    // If decision exists, index it
    if (exp.decision) {
      activeDecisionHistory.recordDecision(exp.decision, 90);
    }

    // Adaptive weights learning outcome update
    const vScore = exp.planningResult?.candidates[0]?.verificationScore || 90;
    activeRecommendationLearner.learnFromOutcome(exp.outcomeStatus, vScore);
  }

  public getExperiences(): EngineeringExperience[] {
    return this.activeExperiences;
  }

  public getPatterns(): ExtractedPattern[] {
    return this.activePatterns;
  }
}

export const activeEngineeringMemory = new EngineeringMemory();
