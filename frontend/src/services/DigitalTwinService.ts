import { TwinStateManager } from "../products/twin/engine/TwinStateManager";
import { TwinEventBus } from "../products/twin/engine/TwinEventBus";

export class DigitalTwinService {
  private stateManager: TwinStateManager;
  private eventBus: TwinEventBus;

  constructor() {
    this.stateManager = new TwinStateManager();
    this.eventBus = new TwinEventBus();
  }

  getStateManager(): TwinStateManager {
    return this.stateManager;
  }

  getEventBus(): TwinEventBus {
    return this.eventBus;
  }
}
