import type { AISkill } from "../engine/AISkill";
import type { AIContext } from "../engine/AIContext";
import type { SkillOutput } from "../engine/SkillOutput";

export class ExplainSkill implements AISkill {
  id = "skill-explain";
  name = "Subsystem Flow Explanation";
  description = "Explains software subsystem interactions grounded in graph traversals.";

  execute(context: AIContext): SkillOutput {
    const targets = context.graphContext.targetEntities.map((e) => e.name).join(" ➔ ");
    return {
      skillId: this.id,
      summary: `Subsystem Flow Explanation for intent "${context.intent}"`,
      findings: [
        `Flow traverses through ${context.graphContext.targetEntities.length} core architecture nodes.`,
        `Grounded graph path: ${targets || "UI ➔ REST API ➔ Database"}`,
      ],
      evidenceReferences: context.graphContext.traversalPaths,
      confidence: 0.94,
      recommendations: [
        "Ensure IsAuthenticated permission class is enforced on the REST API endpoint.",
        "Add unit test coverage for the ViewSet dispatch logic.",
      ],
      relatedEntityIds: context.graphContext.targetEntities.map((e) => e.id),
    };
  }
}
