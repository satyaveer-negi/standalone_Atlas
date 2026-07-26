import { EngineeringSituation, SituationSeverity } from "./EngineeringSituation";

export interface CorrelatedSituation {
  id: string;
  situation: EngineeringSituation;
  relatedEvents: string[];
  correlationRulesApplied: string[];
  severity: SituationSeverity;
  confidenceScore: number; // 0-100
  rootCauseHypothesis: string;
  recommendationTriggered: boolean;
  evidenceRefs: string[];
}
