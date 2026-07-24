import type { SemanticKnowledgeGraph } from "../../../engine/scene/SemanticKnowledgeGraph";
import type { DeclarativeRule } from "./RuleAST";
import { ViolationStore } from "./ViolationStore";
import type { ManagedViolation } from "./ViolationStore";

export class RuleEvaluator {
  private violationStore: ViolationStore;

  constructor(violationStore?: ViolationStore) {
    this.violationStore = violationStore || new ViolationStore();
  }

  evaluateRule(rule: DeclarativeRule, graph: SemanticKnowledgeGraph): ManagedViolation[] {
    const violations: ManagedViolation[] = [];
    const entities = graph.getAllEntities();

    const matchingSources = entities.filter((e) => e.type === rule.sourceType);

    matchingSources.forEach((src) => {
      src.relationships.forEach((rel) => {
        const target = graph.getEntity(rel.targetId);
        if (target && target.type === rule.forbiddenType) {
          const violation: ManagedViolation = {
            id: `v-${rule.id}-${src.id}-${target.id}`,
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            sourceEntityId: src.id,
            targetEntityId: target.id,
            graphEvidence: [`${src.name} --[${rel.relation}]--> ${target.name}`],
            status: "Open",
            timestamp: Date.now(),
          };
          this.violationStore.addViolation(violation);
          violations.push(violation);
        }
      });
    });

    return violations;
  }

  getViolationStore(): ViolationStore {
    return this.violationStore;
  }
}
