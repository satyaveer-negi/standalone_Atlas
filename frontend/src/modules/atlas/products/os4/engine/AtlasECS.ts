import type { IEntity, IComponent, ISystem } from "./AtlasContracts";

export class AtlasEntity implements IEntity {
  id: string;
  name: string;
  type: string;
  components = new Map<string, any>();
  version = "1.0.0";
  createdAt = Date.now();

  constructor(id: string, name: string, type: string) {
    this.id = id;
    this.name = name;
    this.type = type;
  }

  addComponent(type: string, component: IComponent) {
    this.components.set(type, component);
  }

  getComponent<T>(type: string): T | undefined {
    return this.components.get(type);
  }
}

export class PhysicsSystem implements ISystem {
  name = "PhysicsSystem";

  update(entities: IEntity[], deltaTime: number): void {
    for (const entity of entities) {
      const phys = entity.components.get("PhysicsComponent");
      if (phys) {
        phys.properties.velocity += phys.properties.acceleration * deltaTime;
      }
    }
  }
}

export class ReasoningSystem implements ISystem {
  name = "ReasoningSystem";

  update(entities: IEntity[], deltaTime: number): void {
    for (const entity of entities) {
      const reason = entity.components.get("ReasoningComponent");
      if (reason) {
        reason.properties.lastEvaluated = Date.now();
      }
    }
  }
}

export class AtlasECSManager {
  private entities: Map<string, IEntity> = new Map();

  createEntity(id: string, name: string, type: string): IEntity {
    const entity = new AtlasEntity(id, name, type);
    this.entities.set(id, entity);
    return entity;
  }

  getEntities(): IEntity[] {
    return Array.from(this.entities.values());
  }
}
