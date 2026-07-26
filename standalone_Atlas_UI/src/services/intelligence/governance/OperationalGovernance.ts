import { EngineeringSituation } from "../runtime/EngineeringSituation";
import { EngineeringRecommendation } from "../decision/EngineeringRecommendation";
import { EngineeringAction } from "./EngineeringAction";
import { GovernanceDecision } from "./GovernanceDecision";
import { activePolicyDecisionEngine } from "./PolicyDecisionEngine";
import { activeComplianceEvaluator } from "./ComplianceEvaluator";
import { activeActionAuthorizer } from "./ActionAuthorizer";
import { activeSafetyInterlock } from "./SafetyInterlock";
import { activeApprovalWorkflow } from "./ApprovalWorkflow";

export class OperationalGovernance {
  public govern(
    situation: EngineeringSituation,
    rec: EngineeringRecommendation | null
  ): { action: EngineeringAction; decision: GovernanceDecision } {
    
    const actionId = `act-${Date.now()}`;
    
    const action: EngineeringAction = {
      actionId,
      triggerSituation: situation,
      recommendation: rec,
      governingPolicies: [],
      complianceReport: null,
      approvalChain: {
        chainId: `chain-${Date.now()}`,
        currentLevel: "Operator",
        requiredApprovals: ["Operator", "Lead"],
        approvedBy: [],
        approvalType: "Hybrid",
        chainStatus: "Draft"
      },
      executionIntent: {
        intentId: `exec-intent-${Date.now()}`,
        actionId,
        executionParameters: { targetLoadKW: 40 },
        timeoutMs: 60000,
        retriesAllowed: 3,
        rollbackTriggerConditions: ["voltage > 120V"],
        verificationCriteria: ["temperature < 320°C"]
      },
      rollbackPlanText: "Revert switcher load back to 40kW default threshold limits.",
      verificationPlanText: "Assert temperature cools down under 325°C bounds.",
      status: "Draft",
      version: 1
    };

    // 1. Evaluate policies & compliances
    const activePolicy = activePolicyDecisionEngine.evaluate(action);
    action.governingPolicies.push(activePolicy);

    const complianceReport = activeComplianceEvaluator.evaluateCompliance(action);
    action.complianceReport = complianceReport;

    // 2. Resolve safety interlocks
    const interlock = activeSafetyInterlock.evaluateInterlocks(action);
    const safetyConstraintsChecked = [interlock.message];

    // 3. Resolve authorization outcomes
    const authStatus = activeActionAuthorizer.resolveAuthorization(action);

    const decision: GovernanceDecision = {
      decisionId: `gov-dec-${Date.now()}`,
      actionId,
      policyEvaluated: activePolicy,
      complianceReport,
      authorization: authStatus,
      safetyConstraintsChecked,
      explanation: `Operational evaluation computed compliance overall: ${complianceReport.overallStatus}. Interlock engaged: ${interlock.engaged}.`,
      timestamp: new Date().toISOString()
    };

    if (authStatus === "ApprovalRequired") {
      activeApprovalWorkflow.requestApproval(action);
    } else {
      action.status = "Approved";
    }

    return { action, decision };
  }
}

export const activeOperationalGovernance = new OperationalGovernance();
