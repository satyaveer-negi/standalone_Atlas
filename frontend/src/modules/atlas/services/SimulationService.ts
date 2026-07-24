import type { SemanticKnowledgeGraph } from "../engine/scene/SemanticKnowledgeGraph";
import { SandboxSession } from "../products/simulate/engine/SandboxSession";
import type { ChangeSet } from "../products/simulate/engine/ChangeSet";

export class SimulationService {
  createSession(liveGraph: SemanticKnowledgeGraph): SandboxSession {
    return new SandboxSession(liveGraph);
  }

  applyChangeSet(session: SandboxSession, changeSet: ChangeSet) {
    changeSet.operations.forEach((op) => {
      if (op.type === "REMOVE_ENTITY") {
        session.clonedGraph.removeEntity(op.targetEntityId);
      }
    });
  }
}
