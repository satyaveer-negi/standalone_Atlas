import { DriftDetectionEngine } from "../products/living/engine/DriftDetectionEngine";
import { LivingSyncEngine } from "../products/living/engine/LivingSyncEngine";
import { ARCHITECTURE_REVISIONS } from "../products/living/engine/ArchitectureTimelineStore";

export class LivingArchService {
  private driftEngine: DriftDetectionEngine;
  private syncEngine: LivingSyncEngine;

  constructor() {
    this.driftEngine = new DriftDetectionEngine();
    this.syncEngine = new LivingSyncEngine();
  }

  getDriftEngine(): DriftDetectionEngine {
    return this.driftEngine;
  }

  getSyncEngine(): LivingSyncEngine {
    return this.syncEngine;
  }

  getRevisions() {
    return ARCHITECTURE_REVISIONS;
  }
}
