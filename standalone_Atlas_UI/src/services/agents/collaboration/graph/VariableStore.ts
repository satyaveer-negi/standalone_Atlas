import { Variable } from "./Variable";
import { activeStateAdapter } from "../state/StateAdapter";
import { activeCollabEventBus } from "../events/EventBus";

export class VariableStore {
  private variables = new Map<string, Variable>();

  public publishVariable(name: string, type: "string" | "number" | "boolean" | "object", unit: string, value: any, producerAgent?: string): void {
    const variable: Variable = {
      id: `var-${Date.now()}-${name}`,
      name,
      type,
      unit,
      value,
      producerAgent,
      timestamp: new Date().toLocaleTimeString()
    };

    this.variables.set(name, variable);

    // Sync to Blackboard Adapter
    activeStateAdapter.writeState(name, {
      name,
      value,
      unit,
      producerAgent: producerAgent ?? "System"
    });

    // Notify Event Bus
    activeCollabEventBus.publish("VariablePublished", {
      name,
      unit,
      value,
      producerAgent
    });
  }

  public getVariable(name: string): Variable | null {
    return this.variables.get(name) ?? null;
  }

  public getVariablesList(): Variable[] {
    return Array.from(this.variables.values());
  }

  public clear(): void {
    this.variables.clear();
  }
}

export const activeVariableStore = new VariableStore();
