export interface SkillOutput {
  skillId: string;
  summary: string;
  findings: string[];
  evidenceReferences: string[];
  confidence: number;
  recommendations: string[];
  relatedEntityIds: string[];
}
