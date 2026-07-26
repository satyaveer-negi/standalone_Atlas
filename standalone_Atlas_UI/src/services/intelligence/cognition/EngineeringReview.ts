import { ConsensusResult } from "./ConsensusEngine";
import { ConflictRecord } from "./ConflictResolver";

export interface EngineeringReview {
  id: string;
  deliberationId: string;
  consensusStats: ConsensusResult;
  conflictsLogs: ConflictRecord[];
  residualRisks: string[];
  recommendationNote: string;
  createdAt: string;
}
