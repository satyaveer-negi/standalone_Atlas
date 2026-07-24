export interface Provenance {
  creator: string;       // e.g., "AI Agent: GPT-4", "User: Ankit", "Solver: OpenFOAM"
  eventSource: string;   // e.g., "GitHub Push event: d9231f", "Simulation finished"
  timestamp: number;
  packageOrigin: string; // e.g., "openfoam.atlaskp"
}

// 📦 UNIVERSAL DATA MODEL: base interface for all objects in UKOP 2.0
export interface AtlasObject {
  id: string;
  type: string;          // e.g., "KnowledgeObject", "CADModel", "Dataset", "Report"
  version: number;
  provenance: Provenance;
  relationships: { targetId: string; type: string }[];
}

export interface KnowledgeObject extends AtlasObject {
  title: string;
  content: string;       // Immutable semantic content representation
  evidenceList: string[];
}

// 🌐 ATLAS KNOWLEDGE GRAPH (AKG) - platform persistent memory
export class AtlasKnowledgeGraph {
  private nodes = new Map<string, AtlasObject>();

  public insertObject(obj: AtlasObject): void {
    console.log(`[AKG Registry] Persisting object [${obj.type}] ID: ${obj.id} (v${obj.version}). Creator: ${obj.provenance.creator}`);
    this.nodes.set(obj.id, obj);
  }

  public getObject(id: string): AtlasObject | undefined {
    return this.nodes.get(id);
  }

  public findRelated(id: string, typeFilter?: string): AtlasObject[] {
    const node = this.nodes.get(id);
    if (!node) return [];

    return node.relationships
      .filter((r) => !typeFilter || r.type === typeFilter)
      .map((r) => this.nodes.get(r.targetId))
      .filter((obj): obj is AtlasObject => !!obj);
  }

  public size(): number {
    return this.nodes.size;
  }
}

export const activeKnowledgeGraph = new AtlasKnowledgeGraph();
