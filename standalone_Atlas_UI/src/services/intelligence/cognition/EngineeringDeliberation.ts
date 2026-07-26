import { EngineeringIntent } from "../intent/EngineeringIntent";
import { TaskDecompositionNode } from "./TaskDecomposer";
import { AgentOpinion } from "./SpecialistAgent";
import { EvidenceSource } from "./EvidenceAggregator";

export interface DeliberationTimelineEvent {
  timestamp: string;
  agentName: string;
  actionTaken: string;
  consensusSnapshotPercent: number;
}

export interface EngineeringDeliberation {
  id: string;
  intent: EngineeringIntent;
  tasks: TaskDecompositionNode[];
  opinions: AgentOpinion[];
  evidence: EvidenceSource[];
  timeline: DeliberationTimelineEvent[];
  createdAt: string;
}
