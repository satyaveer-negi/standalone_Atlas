import { SkillRegistry } from "./SkillRegistry";
import type { AIContext } from "./AIContext";
import type { ExecutionPlan } from "./ExecutionPlan";
import type { SkillOutput } from "./SkillOutput";

export class ExecutionOrchestrator {
  private registry: SkillRegistry;

  constructor(registry?: SkillRegistry) {
    this.registry = registry || new SkillRegistry();
  }

  generatePlan(intent: string, skillId: string): ExecutionPlan {
    const skill = this.registry.getSkill(skillId);
    return {
      planId: `plan-${Date.now()}`,
      intent,
      steps: [
        { stepNumber: 1, title: "Assemble Grounded Multi-Source Context", status: "COMPLETED" },
        { stepNumber: 2, title: `Execute Skill: ${skill ? skill.name : skillId}`, skillId, status: "EXECUTING" },
        { stepNumber: 3, title: "Aggregate Evidence & Generate Recommendations", status: "PENDING" },
      ],
    };
  }

  executeSkill(skillId: string, context: AIContext): SkillOutput | null {
    const skill = this.registry.getSkill(skillId);
    if (!skill) return null;
    return skill.execute(context);
  }
}
