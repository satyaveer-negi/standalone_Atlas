import type { GraphQueryEngine } from "../scene/GraphQueryEngine";

export interface MissionDefinition {
  id: string;
  title: string;
  startEntityId: string;
  traverseRelations: string[];
}

export interface CompiledExecutableMission {
  id: string;
  title: string;
  traversalPath: Array<{ id: string; name: string }>;
}

export class MissionCompiler {
  private queryEngine: GraphQueryEngine;

  constructor(queryEngine: GraphQueryEngine) {
    this.queryEngine = queryEngine;
  }

  compile(def: MissionDefinition): CompiledExecutableMission {
    const startEnt = this.queryEngine.entity(def.startEntityId).impact()[0];
    const neighbors = this.queryEngine.entity(def.startEntityId).neighbors().impact();

    const path = [];
    if (startEnt) path.push({ id: startEnt.id, name: startEnt.name });
    neighbors.forEach((n) => path.push({ id: n.id, name: n.name }));

    return {
      id: def.id,
      title: def.title,
      traversalPath: path,
    };
  }
}
