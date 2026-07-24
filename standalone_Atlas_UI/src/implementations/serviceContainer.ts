export class ServiceContainer {
  private static instance: ServiceContainer;
  private services = new Map<string, any>();

  private constructor() {}

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  public register<T>(name: string, service: T): void {
    console.log(`[Service Container] Registering service dependency: "${name}"`);
    this.services.set(name, service);
  }

  public resolve<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`[Service Container] Critical dependency resolution failed: "${name}" not registered.`);
    }
    return service;
  }

  public clear(): void {
    this.services.clear();
  }
}

export const container = ServiceContainer.getInstance();
