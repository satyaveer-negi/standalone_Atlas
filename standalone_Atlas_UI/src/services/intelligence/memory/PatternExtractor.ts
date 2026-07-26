import { EngineeringExperience } from "./EngineeringExperience";

export interface ExtractedPattern {
  id: string;
  name: string;
  type: "DesignPattern" | "EngineeringPractice";
  description: string;
  reusableRuleExpression: string;
}

export class PatternExtractor {
  public extractPatterns(exp: EngineeringExperience): ExtractedPattern[] {
    const patterns: ExtractedPattern[] = [];

    // Check design configurations
    if (exp.outcomeStatus === "Success") {
      patterns.push({
        id: `pat-${exp.id}-01`,
        name: `Design Pattern: ${exp.projectName} Topology`,
        type: "DesignPattern",
        description: `Verified converter sequence template from success project ID ${exp.id}.`,
        reusableRuleExpression: "converterTopology == verifiedGridSubstation"
      });

      patterns.push({
        id: `pat-${exp.id}-02`,
        name: `Engineering Practice: V&V Review Strategy`,
        type: "EngineeringPractice",
        description: "Enforce CFD Specialist approval gates checkpoints before committing execution workflows.",
        reusableRuleExpression: "councilQuorumCount >= 3"
      });
    }

    return patterns;
  }
}

export const activePatternExtractor = new PatternExtractor();
