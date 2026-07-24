import type { Entity } from "../entity/Entity";

export class GraphStore {
  private entities: Map<string, Entity> = new Map();

  addEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
  }

  getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  removeEntity(id: string) {
    this.entities.delete(id);
  }

  getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  clear() {
    this.entities.clear();
  }
}
