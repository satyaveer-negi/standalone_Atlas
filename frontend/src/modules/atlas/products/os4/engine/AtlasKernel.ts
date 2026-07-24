import type { IKernel, ISystem, IEntity } from "./AtlasContracts";

export class AtlasKernel implements IKernel {
  private systems: ISystem[] = [];
  private initialized = false;

  initialize(): void {
    this.initialized = true;
  }

  registerSystem(system: ISystem): void {
    this.systems.push(system);
  }

  step(deltaTime: number, entities: IEntity[] = []): void {
    if (!this.initialized) this.initialize();
    for (const system of this.systems) {
      system.update(entities, deltaTime);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
