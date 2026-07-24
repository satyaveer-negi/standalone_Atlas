import type { GraphQueryEngine } from "../scene/GraphQueryEngine";
import type { DigitalTwinStateStore } from "../twin/DigitalTwinStateStore";
import type { GitTimelineEngine } from "../git/GitTimelineEngine";

export interface GroundedAIContext {
  question: string;
  targetEntities: Array<{
    id: string;
    name: string;
    type: string;
    couplingRisk: string;
    runtimeStatus?: string;
    recentCommitsCount: number;
  }>;
  summary: string;
}

export class AIGraphContext {
  private queryEngine: GraphQueryEngine;
  private stateStore?: DigitalTwinStateStore;
  private gitEngine?: GitTimelineEngine;

  constructor(
    queryEngine: GraphQueryEngine,
    stateStore?: DigitalTwinStateStore,
    gitEngine?: GitTimelineEngine
  ) {
    this.queryEngine = queryEngine;
    this.stateStore = stateStore;
    this.gitEngine = gitEngine;
  }

  buildContextForQuestion(question: string, startEntityId: string): GroundedAIContext {
    const impactedEntities = this.queryEngine.entity(startEntityId).neighbors().impact();

    const targetEntities = impactedEntities.map((ent) => {
      const state = this.stateStore?.getEntityState(ent.id);
      const commits = this.gitEngine?.getEntityHistory(ent.id) || [];
      return {
        id: ent.id,
        name: ent.name,
        type: ent.type,
        couplingRisk: ent.diagnostics.couplingRisk,
        runtimeStatus: state?.runtime?.status || "idle",
        recentCommitsCount: commits.length,
      };
    });

    return {
      question,
      targetEntities,
      summary: `Grounded graph context with ${targetEntities.length} entities analyzed.`,
    };
  }
}
