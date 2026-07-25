import { CapabilityRegistry } from "../../registry/CapabilityRegistry";
import { cfdAgentPlugin } from "../../plugins/cfd/cfdDomainAgent";

export class SchedulerAssertions {
  public assertExpertFallback(registry: CapabilityRegistry): { passed: boolean; message: string } {
    // 1. Unregister or mark CFD busy/offline
    registry.updateHealth("agent-cfd-optimizer", "Offline");
    
    // Querying for "cfdAudit" should return null since primary is offline
    const fallbackResult = registry.findExpertForCapability("cfdAudit");

    // Restore health for baseline execution correctness
    registry.updateHealth("agent-cfd-optimizer", "Available");

    if (fallbackResult === null) {
      return { passed: true, message: "Registry correctly handled offline agent capability query fallback." };
    }
    return { passed: false, message: "Registry query fallback did not correctly return null for offline agent." };
  }

  public assertExpertMatching(registry: CapabilityRegistry): { passed: boolean; message: string } {
    const expert = registry.findExpertForCapability("cfdAudit");
    if (expert && expert.id === "agent-cfd-optimizer") {
      return { passed: true, message: `Dynamic Capability matching successfully routed task to CFD specialist agent.` };
    }
    return { passed: false, message: "Capability matching failed to locate CFD specialist agent." };
  }
}
