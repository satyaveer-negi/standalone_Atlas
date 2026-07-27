export interface ContributingContextProvenance {
  context: string;
  snapshotId: string;
  timestamp: string;
}

export type EnterpriseSyncStatus = "Synchronized" | "Drifting" | "OutofSync";

export interface EnterpriseIntelligenceModel {
  orchestrationId: string;
  synthesizedAt: string;
  activeStrategiesCount: number;
  totalActivePrograms: number;
  averageMaturityLevel: number; // 1 to 5
  ecosystemTrustIndex: number; // out of 100
  innovationVelocity: number; // out of 100
  overallAdaptabilityScore: number; // out of 100
  contributingContexts: ContributingContextProvenance[];
  status: EnterpriseSyncStatus;
}
