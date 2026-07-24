import { Provenance } from "./akg";

// 📣 FROZEN MESSAGING FABRIC EVENT CONTRACT
export interface AtlasEvent {
  id: string;
  timestamp: number;
  source: string;        // e.g. "github-webhook", "openfoam-solver"
  package: string;       // e.g. "openfoam.atlaskp"
  type: string;          // e.g. "simulation.completed", "issue.assigned"
  payload: Record<string, any>;
  provenance: Provenance;
  correlationId: string; // Traces complete transactional boundaries
  causationId: string;   // Traces the immediate triggering event parent
}
