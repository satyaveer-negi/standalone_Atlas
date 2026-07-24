export interface CapabilityDescriptor {
  id: string;
  name: string;
  category: "lens" | "inspectorTab" | "mission" | "command" | "analyzer";
  version: string;
  provider: string;
  enabled: boolean;
}

export class CapabilityRegistry {
  private capabilities: Map<string, CapabilityDescriptor> = new Map();

  register(descriptor: Omit<CapabilityDescriptor, "enabled">) {
    const fullDescriptor: CapabilityDescriptor = {
      ...descriptor,
      enabled: true,
    };
    this.capabilities.set(descriptor.id, fullDescriptor);
  }

  unregister(id: string) {
    this.capabilities.delete(id);
  }

  get(id: string): CapabilityDescriptor | undefined {
    return this.capabilities.get(id);
  }

  getByCategory(category: CapabilityDescriptor["category"]): CapabilityDescriptor[] {
    return Array.from(this.capabilities.values()).filter(
      (cap) => cap.category === category && cap.enabled
    );
  }

  getAll(): CapabilityDescriptor[] {
    return Array.from(this.capabilities.values());
  }
}
