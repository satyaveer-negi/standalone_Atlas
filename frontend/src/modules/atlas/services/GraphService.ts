import type { GraphQueryEngine } from "../engine/scene/GraphQueryEngine";
import type { Entity } from "../engine/entity/Entity";

export class GraphService {
  private queryEngine: GraphQueryEngine;

  constructor(queryEngine: GraphQueryEngine) {
    this.queryEngine = queryEngine;
  }

  findEntity(id: string): Entity | undefined {
    return this.queryEngine.entity(id).getEntities()[0];
  }

  findDependencies(entityId: string): Entity[] {
    return this.queryEngine.entity(entityId).neighbors().getEntities();
  }

  impact(entityId: string): Entity[] {
    return this.queryEngine.entity(entityId).neighbors().impact();
  }

  search(query: string): Entity[] {
    const all = this.queryEngine.entity("repo-root").neighbors().getEntities();
    return all.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
  }
}
