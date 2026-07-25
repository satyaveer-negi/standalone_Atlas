import { SharedTaskGraph } from "../graph/SharedTaskGraph";
import { activeCapabilityRegistry } from "../registry/CapabilityRegistry";
import { activeVariableStore } from "../graph/VariableStore";
import { ParsedSubGoal } from "./GoalParser";

export class TaskScheduler {
  public async executeScheduler(subGoals: ParsedSubGoal[], graph: SharedTaskGraph): Promise<void> {
    const nodes = graph.getNodes();
    
    // Sort nodes to satisfy dependencies (topological sort style matching)
    // For standalone demo simplicity, we prioritize nodes with zero inputs first
    const sortedGoals = [...subGoals].sort((a, b) => a.inputs.length - b.inputs.length);

    for (const goal of sortedGoals) {
      const node = nodes.find(n => n.id === goal.id);
      if (!node) continue;

      graph.updateNodeStatus(node.id, "Queued");
      graph.updateNodeStatus(node.id, "Running");

      // 1. Discover expert from dynamic Capability Registry
      const expertAgent = activeCapabilityRegistry.findExpertForCapability(goal.capabilityRequired);
      
      if (!expertAgent) {
        console.warn(`[Collab Scheduler] No registered Available agent matches capability: "${goal.capabilityRequired}"`);
        graph.updateNodeStatus(node.id, "Failed");
        continue;
      }

      // Assign agent ID to node
      node.assignedAgentId = expertAgent.id;

      try {
        console.log(`[Collab Scheduler] Routing "${goal.objective}" to specialized agent: "${expertAgent.name}"`);
        
        // Trigger Domain Expert verification checks
        const result = await expertAgent.agentInstance.runEvaluationLoop({
          objective: goal.objective,
          context: { variables: activeVariableStore.getVariablesList() }
        });

        // Publish outputs to blackboard variable store
        goal.outputs.forEach(outputVar => {
          activeVariableStore.publishVariable(
            outputVar,
            "number",
            "Units",
            result.score,
            expertAgent.name
          );
        });

        graph.updateNodeStatus(node.id, "Completed");
      } catch (err) {
        console.error(`[Collab Scheduler] Execution error on node "${node.id}":`, err);
        graph.updateNodeStatus(node.id, "Failed");
      }
    }
  }
}
