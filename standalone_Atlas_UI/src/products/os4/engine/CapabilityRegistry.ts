export interface RegisteredCapability {
  capabilityId: string; // e.g., "simulation.cfd", "latex.compiler", "robotics.kinematics"
  providerName: string;
  requiredPermission: string;
}

export class CapabilityRegistry {
  private capabilities = new Map<string, RegisteredCapability[]>();

  registerCapability(cap: RegisteredCapability): void {
    if (!this.capabilities.has(cap.capabilityId)) {
      this.capabilities.set(cap.capabilityId, []);
    }
    this.capabilities.get(cap.capabilityId)!.push(cap);
  }

  findCapability(capabilityId: string): RegisteredCapability[] {
    return this.capabilities.get(capabilityId) || [];
  }

  getAllCapabilities(): RegisteredCapability[] {
    const list: RegisteredCapability[] = [];
    for (const arr of this.capabilities.values()) {
      list.push(...arr);
    }
    return list;
  }
}
