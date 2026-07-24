import type { GraphService } from "./GraphService";

export interface GroundedFixRecommendation {
  ruleId: string;
  reason: string;
  confidence: number;
  graphEvidence: string[];
  suggestedRefactor: string;
  affectedFiles: string[];
}

export class AIService {
  private graphService: GraphService;

  constructor(graphService: GraphService) {
    this.graphService = graphService;
  }

  generateGroundedFix(ruleId: string, sourceId: string, targetId: string): GroundedFixRecommendation {
    const sourceEnt = this.graphService.findEntity(sourceId);
    const targetEnt = this.graphService.findEntity(targetId);

    const sourceName = sourceEnt ? sourceEnt.name : sourceId;
    const targetName = targetEnt ? targetEnt.name : targetId;

    return {
      ruleId,
      reason: `Direct coupling detected between UI component [${sourceName}] and Database entity [${targetName}].`,
      confidence: 0.95,
      graphEvidence: [`${sourceName} --[queries]--> ${targetName}`],
      suggestedRefactor: `Refactor ${sourceName} to fetch data via Django REST API ViewSet (/api/tasks/) instead of direct table queries.`,
      affectedFiles: [sourceName, targetName],
    };
  }
}
