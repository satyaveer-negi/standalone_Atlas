import { ScenarioRunner } from "./ScenarioRunner";
import { AssertionRunner } from "./AssertionRunner";
import { PerformanceCollector } from "../metrics/PerformanceCollector";
import { VerificationReport, TestResult } from "../reports/VerificationReport";
import { Pillar1ComplianceTests } from "../compliance/Pillar1Tests";
import { Pillar2ComplianceTests } from "../compliance/Pillar2Tests";
import { Pillar3ComplianceTests } from "../compliance/Pillar3Tests";
import { Pillar4ComplianceTests } from "../compliance/Pillar4Tests";
import { Pillar5ComplianceTests } from "../compliance/Pillar5Tests";

import { activeTwinVerificationContributor } from "../../../../twin/verification/TwinVerificationContributor";
import { activeDistributedTwinVerificationContributor } from "../../../../twin/distributed/verification/DistributedTwinVerificationContributor";
import { activeWorkflowVerificationContributor } from "../../../../workflow/verification/WorkflowVerificationContributor";
import { activeIntentVerificationContributor } from "../../../../intelligence/verification/IntentVerificationContributor";
import { activePlanningVerificationContributor } from "../../../../intelligence/verification/PlanningVerificationContributor";
import { activeCouncilVerificationContributor } from "../../../../intelligence/verification/CouncilVerificationContributor";
import { activeMemoryVerificationContributor } from "../../../../intelligence/verification/MemoryVerificationContributor";
import { activeDecisionVerificationContributor } from "../../../../intelligence/verification/DecisionVerificationContributor";
import { activeRuntimeVerificationContributor } from "../../../../intelligence/verification/RuntimeVerificationContributor";
import { activeGovernanceVerificationContributor } from "../../../../intelligence/verification/GovernanceVerificationContributor";
import { activeSynthesisVerificationContributor } from "../../../../intelligence/verification/SynthesisVerificationContributor";
import { activeEvolutionVerificationContributor } from "../../../../intelligence/verification/EvolutionVerificationContributor";
import { activeMetaCognitiveVerificationContributor } from "../../../../intelligence/verification/MetaCognitiveVerificationContributor";
import { activeConstitutionVerificationContributor } from "../../../../intelligence/verification/ConstitutionVerificationContributor";

export class VerificationEngine {
  private scenarioRunner = new ScenarioRunner();
  private assertionRunner = new AssertionRunner();
  private perfCollector = new PerformanceCollector();
  
  // Compliance suites
  private p1 = new Pillar1ComplianceTests();
  private p2 = new Pillar2ComplianceTests();
  private p3 = new Pillar3ComplianceTests();
  private p4 = new Pillar4ComplianceTests();
  private p5 = new Pillar5ComplianceTests();

  public async runFullSuite(prompt: string): Promise<VerificationReport> {
    const report = new VerificationReport();

    // 1. Run Scenario
    const start = Date.now();
    await this.scenarioRunner.runScenario(prompt);
    const latency = Date.now() - start;

    // 2. Evaluate Assertion checks
    const assertions = this.assertionRunner.runAllAssertions();
    assertions.forEach(ast => report.addResult(ast));

    // Evaluate Digital Twin integrity checks
    const twinAsserts = activeTwinVerificationContributor.verifyTwinIntegrity();
    twinAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Distributed Twin Ecosystem checks
    const distTwinAsserts = activeDistributedTwinVerificationContributor.verifyDistributedEcosystem();
    distTwinAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Workflow Composer & Cognitive Orchestration checks
    const workflowAsserts = activeWorkflowVerificationContributor.verifyWorkflowEcosystem();
    workflowAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Cognitive Intent Intelligence checks
    const intentAsserts = activeIntentVerificationContributor.verifyIntentEcosystem();
    intentAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Cognitive Planning Intelligence checks
    const planningAsserts = activePlanningVerificationContributor.verifyPlanningEcosystem();
    planningAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Cognitive Council Deliberation checks
    const councilAsserts = activeCouncilVerificationContributor.verifyCouncilEcosystem();
    councilAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Engineering Memory & Organizational Learning checks
    const memoryAsserts = activeMemoryVerificationContributor.verifyMemoryEcosystem();
    memoryAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Decision Intelligence checks
    const decisionAsserts = activeDecisionVerificationContributor.verifyDecisionEcosystem();
    decisionAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Continuous Twin Intelligence checks
    const runtimeAsserts = activeRuntimeVerificationContributor.verifyRuntimeEcosystem();
    runtimeAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Autonomous Policy & Governance Engine checks
    const governanceAsserts = activeGovernanceVerificationContributor.verifyGovernanceEcosystem();
    governanceAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Engineering Knowledge Synthesis checks
    const synthesisAsserts = activeSynthesisVerificationContributor.verifySynthesisEcosystem();
    synthesisAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Autonomous Engineering Evolution checks
    const evolutionAsserts = activeEvolutionVerificationContributor.verifyEvolutionEcosystem();
    evolutionAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Meta-Cognitive Engineering checks
    const metaAsserts = activeMetaCognitiveVerificationContributor.verifyMetaCognitiveEcosystem();
    metaAsserts.forEach(ast => report.addResult(ast));

    // Evaluate Engineering Constitution checks
    const constAsserts = activeConstitutionVerificationContributor.verifyConstitutionEcosystem();
    constAsserts.forEach(ast => report.addResult(ast));

    // 3. Evaluate EIOS Compliance
    const r1 = this.p1.verifyPillar1();
    report.addResult({
      id: "compliance-p1",
      name: "Pillar 1 Invariant (Runtime vs Gov)",
      status: r1.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: r1.message
    });

    const r2 = this.p2.verifyPillar2();
    report.addResult({
      id: "compliance-p2",
      name: "Pillar 2 Invariant (Memory vs AI)",
      status: r2.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: r2.message
    });

    const r3 = this.p3.verifyPillar3();
    report.addResult({
      id: "compliance-p3",
      name: "Pillar 3 Invariant (Routing vs Store)",
      status: r3.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: r3.message
    });

    const r4 = this.p4.verifyPillar4();
    report.addResult({
      id: "compliance-p4",
      name: "Pillar 4 Invariant (OS vs Expertise)",
      status: r4.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: r4.message
    });

    const r5 = this.p5.verifyPillar5();
    report.addResult({
      id: "compliance-p5",
      name: "Pillar 5 Invariant (Observability vs Behavior)",
      status: r5.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: r5.message
    });

    // 4. Capture Telemetry metrics
    const metrics = this.perfCollector.captureMetrics(3, latency, 2, assertions.length, 3);
    console.log(`[Verification Engine] Latency: ${latency}ms. Metrics:`, metrics);

    return report;
  }
}
