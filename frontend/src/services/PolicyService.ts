import { ENTERPRISE_RULE_PACKS } from "../products/govern/engine/RulePack";
import { RuleEvaluator } from "../products/govern/engine/RuleEvaluator";
import type { SemanticKnowledgeGraph } from "../engine/scene/SemanticKnowledgeGraph";

export interface ComplianceScorecard {
  overall: number;
  architecture: number;
  security: number;
  layering: number;
  testing: number;
  documentation: number;
}

export class PolicyService {
  private evaluator: RuleEvaluator;

  constructor(evaluator?: RuleEvaluator) {
    this.evaluator = evaluator || new RuleEvaluator();
  }

  evaluateGraph(graph: SemanticKnowledgeGraph) {
    const pack = ENTERPRISE_RULE_PACKS[0];
    pack.rules.forEach((rule) => {
      this.evaluator.evaluateRule(rule, graph);
    });
  }

  getScorecard(): ComplianceScorecard {
    const violations = this.evaluator.getViolationStore().getOpenViolations();
    const count = violations.length;
    const penalty = count * 6;

    return {
      overall: Math.max(50, 98 - penalty),
      architecture: 92,
      security: count > 0 ? 84 : 96,
      layering: count > 0 ? 88 : 98,
      testing: 90,
      documentation: 94,
    };
  }

  getViolations() {
    return this.evaluator.getViolationStore().getAllViolations();
  }
}
