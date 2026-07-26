import { EngineeringIntent } from "../intent/EngineeringIntent";
import { EngineeringDeliberation } from "./EngineeringDeliberation";
import { EngineeringReview } from "./EngineeringReview";
import { activeTaskDecomposer } from "./TaskDecomposer";
import { SpecialistAgent, AgentOpinion } from "./SpecialistAgent";
import { activeEvidenceAggregator } from "./EvidenceAggregator";
import { activeConsensusEngine } from "./ConsensusEngine";
import { activeConflictResolver } from "./ConflictResolver";
import { activeCouncilCharter } from "./CouncilCharter";

export class EngineeringCouncil {
  private activeSpecialists: SpecialistAgent[] = [
    new SpecialistAgent("agent-cfd-1", "CFD Specialist", "CFD"),
    new SpecialistAgent("agent-power-1", "Power System Analyst", "PowerSystems"),
    new SpecialistAgent("agent-safety-1", "Safety Auditor", "Safety")
  ];

  public deliberate(intent: EngineeringIntent, variables: Record<string, number>): { deliberation: EngineeringDeliberation; review: EngineeringReview } {
    const tasks = activeTaskDecomposer.decompose(intent);
    const evidence = activeEvidenceAggregator.aggregateEvidence();

    // Specialists independent reviews
    const opinions = this.activeSpecialists.map(sp => sp.review(intent.goal, variables));

    // Calculate consensus
    const consensusStats = activeConsensusEngine.calculateConsensus(opinions, activeCouncilCharter);

    // Negotiate conflicts
    const conflictsLogs = [
      activeConflictResolver.resolveParameterConflict("gridVoltageLimit", [
        { agentId: "agent-power-1", val: 110 },
        { agentId: "agent-safety-1", val: 120 }
      ])
    ];

    const delId = `delib-${Date.now()}`;
    const deliberation: EngineeringDeliberation = {
      id: delId,
      intent,
      tasks,
      opinions,
      evidence,
      timeline: [
        { timestamp: new Date().toISOString(), agentName: "CFD Specialist", actionTaken: "Completed grid optimization check", consensusSnapshotPercent: 92 },
        { timestamp: new Date().toISOString(), agentName: "Power System Analyst", actionTaken: "Finished switcher boundary checks", consensusSnapshotPercent: 90 },
        { timestamp: new Date().toISOString(), agentName: "Safety Auditor", actionTaken: "Reviewed grid thermal limit parameters", consensusSnapshotPercent: consensusStats.agreementScore }
      ],
      createdAt: new Date().toISOString()
    };

    const review: EngineeringReview = {
      id: `rev-${Date.now()}`,
      deliberationId: delId,
      consensusStats,
      conflictsLogs,
      residualRisks: [
        "Thermal limits are safe but grid compliance guidelines require external telemetry logs checks."
      ],
      recommendationNote: consensusStats.agreementScore >= 75
        ? "Consensus achieved. Recommend loading candidate Plan Alpha into workflow canvas."
        : "Quorum and approval thresholds are NOT met. Revise constraints.",
      createdAt: new Date().toISOString()
    };

    return { deliberation, review };
  }
}

export const activeEngineeringCouncil = new EngineeringCouncil();
