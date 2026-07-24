import { GoalInterpreter } from "../products/agent/engine/GoalInterpreter";
import { CapabilityRegistry } from "../products/agent/engine/CapabilityRegistry";
import { AIPlanningEngine } from "../products/agent/engine/AIPlanningEngine";

export class AgentService {
  private interpreter: GoalInterpreter;
  private registry: CapabilityRegistry;
  private planner: AIPlanningEngine;

  constructor() {
    this.interpreter = new GoalInterpreter();
    this.registry = new CapabilityRegistry();
    this.planner = new AIPlanningEngine();
  }

  getInterpreter() { return this.interpreter; }
  getRegistry() { return this.registry; }
  getPlanner() { return this.planner; }
}
