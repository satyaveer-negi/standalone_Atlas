import { TwinDescriptor } from "../core/TwinDescriptor";

export class TwinRegistry {
  private descriptors = new Map<string, TwinDescriptor>();

  public register(desc: TwinDescriptor): void {
    this.descriptors.set(desc.id, desc);
    console.log(`[Twin Registry] Registered Twin: ${desc.displayName} (${desc.id})`);
  }

  public unregister(id: string): void {
    this.descriptors.delete(id);
    console.log(`[Twin Registry] Unregistered Twin: ${id}`);
  }

  public getDescriptor(id: string): TwinDescriptor | null {
    return this.descriptors.get(id) ?? null;
  }

  public getDescriptorsList(): TwinDescriptor[] {
    return Array.from(this.descriptors.values());
  }

  public clear(): void {
    this.descriptors.clear();
  }
}

export const activeTwinRegistry = new TwinRegistry();
