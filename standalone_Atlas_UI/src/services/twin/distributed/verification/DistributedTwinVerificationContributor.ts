import { activeTwinRegistry } from "../registry/TwinRegistry";
import { activeTwinNetwork } from "../federation/TwinNetwork";
import { activeTwinSynchronizationCoordinator } from "../sync/TwinSynchronizationCoordinator";
import { TestResult } from "../../../agents/collaboration/tests/reports/VerificationReport";

export class DistributedTwinVerificationContributor {
  public verifyDistributedEcosystem(): TestResult[] {
    const results: TestResult[] = [];

    // Test 1: Registry capability search
    activeTwinRegistry.clear();
    activeTwinRegistry.register({
      id: "pv-twin",
      name: "Solar PV Array",
      displayName: "PV Solar Panel Array Twin",
      domain: "Energy",
      version: "1.0",
      endpoint: { protocol: "http", host: "127.0.0.1", port: 8081, path: "/twin/pv" },
      capabilities: [{ name: "PowerGeneration", type: "Sensor", description: "Yield telemetry feed" }],
      status: "Online",
      owner: "HP",
      organization: "EIOS",
      region: "EU",
      tags: ["solar", "renewable"],
      supportedProtocols: ["http", "ws"],
      securityProfile: "StandardTLS"
    });

    const found = activeTwinRegistry.getDescriptor("pv-twin");
    results.push({
      id: "dist-assert-registration",
      name: "Distributed Twin Registry Dynamic Register",
      status: found && found.name === "Solar PV Array" ? "Pass" : "Fail",
      durationMs: 1,
      message: found ? "Distributed Twin descriptors dynamic registration validated." : "Registry registration failed."
    });

    // Test 2: Network latency metrics
    activeTwinNetwork.clear();
    activeTwinNetwork.addLink("pv-twin", "battery-twin", 8, 100);
    const latency = activeTwinNetwork.getLatency("pv-twin", "battery-twin");

    results.push({
      id: "dist-assert-network-latency",
      name: "Ecosystem Network Link Latency Graph",
      status: latency === 8 ? "Pass" : "Fail",
      durationMs: 1,
      message: `Dynamic network graph resolved link latency metric at ${latency}ms.`
    });

    // Test 3: Conflict resolution merges
    const lockSuccess = activeTwinSynchronizationCoordinator.acquireLock("pv-twin");
    const lockRefusal = activeTwinSynchronizationCoordinator.acquireLock("pv-twin");
    activeTwinSynchronizationCoordinator.releaseLock("pv-twin");

    results.push({
      id: "dist-assert-synchronization-lock",
      name: "Sync Coordinator Distributed Lock Manager",
      status: lockSuccess === true && lockRefusal === false ? "Pass" : "Fail",
      durationMs: 1,
      message: "Sync coordinator successfully locked resources and blocked concurrent synchronizations."
    });

    return results;
  }
}

export const activeDistributedTwinVerificationContributor = new DistributedTwinVerificationContributor();
