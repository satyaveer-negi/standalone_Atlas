import { SharedTaskGraph } from "../graph/SharedTaskGraph";
import { activeVariableStore } from "../graph/VariableStore";
import { ExecutionContext } from "./ExecutionContext";
import { activeCollabEventBus } from "../events/EventBus";

export class ReportBuilder {
  public compileReport(context: ExecutionContext, graph: SharedTaskGraph): string {
    const nodes = graph.getNodes();
    const variables = activeVariableStore.getVariablesList();
    const completedCount = nodes.filter(n => n.status === "Completed").length;

    const report = `
==================================================
        ATLAS EIOS COLLABORATIVE AUDIT REPORT      
==================================================
Goal Prompt:    "${context.goalPrompt}"
Task ID:        ${context.taskId}
Timestamp:      ${context.timestamp}
Organization:   ${context.organization}

--------------------------------------------------
Task Execution Status (${completedCount}/${nodes.length} Completed):
${nodes.map(n => `* [${n.status}] ${n.objective} (Agent: ${n.assignedAgentId ?? "None"})`).join("\n")}

--------------------------------------------------
Blackboard Variable Store Outputs:
${variables.map(v => `* ${v.name} = ${v.value} ${v.unit} (Producer: ${v.producerAgent ?? "System"})`).join("\n")}
==================================================
`;

    activeCollabEventBus.publish("WorkflowCompleted", { report });
    return report;
  }
}
