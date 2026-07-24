export type RuleSeverity = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface DeclarativeRule {
  id: string;
  name: string;
  severity: RuleSeverity;
  sourceType: string;
  forbiddenType: string;
  message: string;
}

export interface RuleASTNode {
  ruleId: string;
  name: string;
  severity: RuleSeverity;
  sourceFilter: (type: string) => boolean;
  forbiddenFilter: (type: string) => boolean;
}
