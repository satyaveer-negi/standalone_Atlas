export interface MissionState {
  stateId: string;
  missionId: string;
  activePhase: string;
  progressPercentage: number;
  currentSuccessConfidence: number; // percentage probability
  timestamp: string;
  linkedTwinId: string;
  governanceDecisionRef: string;
  operationalOutcomeRef: string;
}
