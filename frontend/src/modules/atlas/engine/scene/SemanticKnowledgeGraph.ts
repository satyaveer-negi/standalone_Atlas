import { GraphStore } from "./GraphStore";
import type { Entity } from "../entity/Entity";

export class SemanticKnowledgeGraph {
  readonly store: GraphStore;

  constructor(store?: GraphStore) {
    this.store = store || new GraphStore();
  }

  addEntity(entity: Entity) {
    this.store.addEntity(entity);
  }

  getEntity(id: string): Entity | undefined {
    return this.store.getEntity(id);
  }

  getAllEntities(): Entity[] {
    return this.store.getAllEntities();
  }
}
