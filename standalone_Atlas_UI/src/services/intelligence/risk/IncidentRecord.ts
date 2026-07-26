export interface IncidentRecord {
  incidentId: string;
  linkedRiskCaseId: string;
  rootCause: string;
  operationalImpact: string;
  correctiveAction: string;
  lessonsLearned: string;
  timestamp: string;
}
