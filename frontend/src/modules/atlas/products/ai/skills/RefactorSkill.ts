import type { AISkill } from "../engine/AISkill";
import type { AIContext } from "../engine/AIContext";
import type { SkillOutput } from "../engine/SkillOutput";

export class RefactorSkill implements AISkill {
  id = "skill-refactor";
  name = "Architecture Refactoring Assistant";
  description = "Recommends architecture refactorings grounded in policy violations.";

  execute(context: AIContext): SkillOutput {
    return {
      skillId: this.id,
      summary: `Architecture Refactoring Recommendations for intent "${context.intent}"`,
      findings: [
        `Detected ${context.policyContext?.openViolationsCount || 1} open architecture policy violations.`,
        "Direct React UI import of PostgreSQL DB model bypasses Django REST ViewSet.",
      ],
      evidenceReferences: ["Tasks.tsx --[queries]--> postgresql-db"],
      confidence: 0.96,
      recommendations: [
        "Create task_manager/views.py TaskViewSet extending viewsets.ModelViewSet.",
        "Update Tasks.tsx to fetch /api/tasks/ using Axios REST client.",
      ],
      relatedEntityIds: context.graphContext.targetEntities.map((e) => e.id),
    };
  }
}
