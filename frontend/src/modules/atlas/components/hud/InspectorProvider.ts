import type { Entity } from "../../engine/entity/Entity";
import type { GraphQueryEngine } from "../../engine/scene/GraphQueryEngine";

export interface InspectorTabContribution {
  id: string;
  label: string;
  icon: string;
  render: (entity: Entity, queryEngine: GraphQueryEngine) => React.ReactNode;
}

export class InspectorRegistry {
  private providers: Map<string, InspectorTabContribution> = new Map();

  registerProvider(provider: InspectorTabContribution) {
    this.providers.set(provider.id, provider);
  }

  getProviders(): InspectorTabContribution[] {
    return Array.from(this.providers.values());
  }
}
