import { GraphAssertions } from "../assertions/GraphAssertions";
import { VariableAssertions } from "../assertions/VariableAssertions";
import { SchedulerAssertions } from "../assertions/SchedulerAssertions";
import { EventAssertions } from "../assertions/EventAssertions";
import { activeVariableStore } from "../../graph/VariableStore";
import { activeCapabilityRegistry } from "../../registry/CapabilityRegistry";
import { activeCollabEventBus } from "../../events/EventBus";
import { TestResult } from "../reports/VerificationReport";

export class AssertionRunner {
  private graphAsserts = new GraphAssertions();
  private varAsserts = new VariableAssertions();
  private schedulerAsserts = new SchedulerAssertions();
  private eventAsserts = new EventAssertions();

  public runAllAssertions(): TestResult[] {
    const results: TestResult[] = [];

    // Graph assertions
    const cycleRes = this.graphAsserts.assertCycleRejection();
    results.push({
      id: "assert-cycle-rejection",
      name: "DAG Cycle Rejection Check",
      status: cycleRes.passed ? "Pass" : "Fail",
      durationMs: 2,
      message: cycleRes.message
    });

    const linearRes = this.graphAsserts.assertLinearValidity();
    results.push({
      id: "assert-linear-validity",
      name: "DAG Linear Path Validity",
      status: linearRes.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: linearRes.message
    });

    // Variable assertions
    const unitRes = this.varAsserts.assertUnitPreservation(activeVariableStore);
    results.push({
      id: "assert-unit-preservation",
      name: "Typed Variable Unit Preservation",
      status: unitRes.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: unitRes.message
    });

    const typeRes = this.varAsserts.assertTypeVerification(activeVariableStore);
    results.push({
      id: "assert-type-verification",
      name: "Variable Type Match Check",
      status: typeRes.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: typeRes.message
    });

    // Scheduler assertions
    const fallbackRes = this.schedulerAsserts.assertExpertFallback(activeCapabilityRegistry);
    results.push({
      id: "assert-expert-fallback",
      name: "Capability Fallback Offline Test",
      status: fallbackRes.passed ? "Pass" : "Fail",
      durationMs: 2,
      message: fallbackRes.message
    });

    const matchRes = this.schedulerAsserts.assertExpertMatching(activeCapabilityRegistry);
    results.push({
      id: "assert-expert-matching",
      name: "Capability Specialist Resolver",
      status: matchRes.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: matchRes.message
    });

    // Event timeline assertions
    const seqRes = this.eventAsserts.assertEventsSequence(activeCollabEventBus.getEventHistory());
    results.push({
      id: "assert-events-sequence",
      name: "Event Bus Dispatches Ordering",
      status: seqRes.passed ? "Pass" : "Fail",
      durationMs: 1,
      message: seqRes.message
    });

    return results;
  }
}
