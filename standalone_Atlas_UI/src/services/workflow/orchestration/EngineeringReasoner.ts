import { WorkflowGraph } from "../model/WorkflowGraph";

export class EngineeringReasoner {
  public reasonGraphCompatibility(graph: WorkflowGraph): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    graph.connections.forEach(conn => {
      const sourceNode = graph.nodes.find(n => n.id === conn.sourceNodeId);
      const targetNode = graph.nodes.find(n => n.id === conn.targetNodeId);

      if (!sourceNode || !targetNode) {
        errors.push(`[Reasoner] Orphan connection found: ${conn.id}`);
        return;
      }

      const outPort = sourceNode.outputs.find(p => p.name === conn.sourcePortName);
      const inPort = targetNode.inputs.find(p => p.name === conn.targetPortName);

      if (!outPort || !inPort) {
        errors.push(`[Reasoner] Port lookup mismatch on connection: ${conn.id}`);
        return;
      }

      if (outPort.type !== inPort.type) {
        errors.push(
          `[Reasoner] Port type mismatch: ${sourceNode.name} (${outPort.type}) -> ${targetNode.name} (${inPort.type})`
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const activeEngineeringReasoner = new EngineeringReasoner();
