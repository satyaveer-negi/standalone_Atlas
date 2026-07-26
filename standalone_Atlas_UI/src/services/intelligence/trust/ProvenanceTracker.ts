export interface ProvenanceCustodyNode {
  nodeId: string;
  sourceArtifactId: string;
  timestamp: string;
  producingComponent: string;
  verificationReference: string;
  signatureStatus: "Verified" | "Failed";
}

export class ProvenanceTracker {
  private nodes: ProvenanceCustodyNode[] = [];

  public registerHop(
    sourceArtifactId: string,
    producingComponent: string,
    verificationReference: string
  ): ProvenanceCustodyNode {
    const node: ProvenanceCustodyNode = {
      nodeId: `hop-${Date.now()}`,
      sourceArtifactId,
      timestamp: new Date().toISOString(),
      producingComponent,
      verificationReference,
      signatureStatus: "Verified"
    };
    
    this.nodes.push(node);
    return node;
  }

  public getHops(): ProvenanceCustodyNode[] {
    return this.nodes;
  }

  public clear(): void {
    this.nodes = [];
  }
}

export const activeProvenanceTracker = new ProvenanceTracker();
