import { CollaborationEngine } from "../products/collaborate/engine/CollaborationEngine";

export class CollaborationService {
  private engine: CollaborationEngine;

  constructor() {
    this.engine = new CollaborationEngine();
  }

  getEngine(): CollaborationEngine {
    return this.engine;
  }
}
