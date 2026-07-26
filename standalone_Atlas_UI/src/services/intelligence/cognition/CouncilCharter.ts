export interface CouncilCharter {
  requiredDisciplines: string[];
  quorumCount: number;
  votingThresholdPercent: number; // e.g. 70% approval needed
}

export const activeCouncilCharter: CouncilCharter = {
  requiredDisciplines: ["CFD", "PowerSystems", "Safety"],
  quorumCount: 3,
  votingThresholdPercent: 75
};
