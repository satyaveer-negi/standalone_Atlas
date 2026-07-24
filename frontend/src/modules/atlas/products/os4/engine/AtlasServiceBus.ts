export class AtlasServiceBus {
  private services = new Map<string, any>();
  private eventListeners = new Map<string, Array<(data: any) => void>>();

  registerService<T>(serviceName: string, serviceInstance: T): void {
    this.services.set(serviceName, serviceInstance);
  }

  resolve<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`[AtlasServiceBus] Service '${serviceName}' not registered in Service Bus.`);
    }
    return service as T;
  }

  publish(eventName: string, data: any): void {
    const listeners = this.eventListeners.get(eventName) || [];
    for (const listener of listeners) {
      listener(data);
    }
  }

  subscribe(eventName: string, listener: (data: any) => void): void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)!.push(listener);
  }
}
