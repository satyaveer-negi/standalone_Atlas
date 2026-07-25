import { activeAgentRuntime, AgentState, AgentLog } from "../agents/runtime/agentRuntime";
import { LearningRecord } from "../agents/learning/learningManager";
import "../agents/plugins/cfd/cfdDomainAgent"; // Trigger static registration

export type { AgentState, AgentLog, LearningRecord };

// 🤖 PUBLIC FACADE CONTAINER WRAPPER FOR PLATFORM STUDIO
export class AutonomousAgentEngine {
  public getState(): AgentState {
    return activeAgentRuntime.getState();
  }

  public getLogs(): AgentLog[] {
    return activeAgentRuntime.getLogs();
  }

  public getLearningRecords(): LearningRecord[] {
    return activeAgentRuntime.getLearningRecords();
  }

  public async runAutonomousCycleAsync(objective: string): Promise<void> {
    await activeAgentRuntime.runAutonomousCycleAsync(objective);
  }
}

export const activeAutonomousAgentEngine = new AutonomousAgentEngine();
