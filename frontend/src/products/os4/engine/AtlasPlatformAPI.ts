import { AtlasECSManager } from "./AtlasECS";
import { SimulationRuntime } from "./SimulationRuntime";
import { DigitalTwinRuntime } from "./DigitalTwinRuntime";
import { AtlasMemory } from "./AtlasMemory";
import { EventStore } from "./EventStore";

export class AtlasPlatformAPI {
  private ecs = new AtlasECSManager();
  private simulation = new SimulationRuntime();
  private twin = new DigitalTwinRuntime();
  private memory = new AtlasMemory();
  private eventStore = new EventStore();

  public entities = {
    create: (id: string, name: string, type: string) => {
      this.eventStore.recordEvent("ENTITY_CREATED", { id, name, type });
      return this.ecs.createEntity(id, name, type);
    },
    list: () => this.ecs.getEntities(),
  };

  public simulations = {
    run: (scenarioId: string, parameters: Record<string, any>) => {
      const result = this.simulation.runSimulation(scenarioId, parameters);
      this.eventStore.recordEvent("SIMULATION_EXECUTED", result);
      return result;
    },
  };

  public twin = {
    register: (twinId: string, entityName: string, domain: string) => {
      const state = {
        twinId,
        entityName,
        domain,
        telemetryMetrics: { tempC: 38, vibrationHz: 12 },
        syncStatus: "SYNCHRONIZED" as const,
        lastUpdated: Date.now(),
      };
      this.twin.registerTwin(state);
      this.eventStore.recordEvent("TWIN_REGISTERED", state);
      return state;
    },
    list: () => this.twin.getTwins(),
  };

  public memoryStore = {
    query: () => this.memory.getMemoryRecords(),
  };

  public events = {
    getHistory: () => this.eventStore.getEventHistory(),
  };
}
