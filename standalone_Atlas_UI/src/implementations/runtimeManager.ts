import type { RuntimeLifecycle, RuntimeState } from "../contracts/lifecycle";

export class RuntimeManager {
  private runtimes = new Map<string, RuntimeLifecycle>();

  public registerRuntime(name: string, runtime: RuntimeLifecycle): void {
    console.log(`[Runtime Manager] Registering runtime component: "${name}"`);
    this.runtimes.set(name, runtime);
  }

  // 🔀 Dependency Topographical Sorting to determine safe load order
  public async loadAll(): Promise<string[]> {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const order: string[] = [];

    const visit = async (name: string) => {
      if (temp.has(name)) {
        throw new Error(`[Runtime Manager] Circular dependency loop detected at runtime component: "${name}"`);
      }
      if (!visited.has(name)) {
        temp.add(name);
        const runtime = this.runtimes.get(name);
        if (runtime) {
          for (const dep of runtime.dependencies) {
            await visit(dep);
          }
        }
        temp.delete(name);
        visited.add(name);
        order.push(name);
      }
    };

    for (const name of this.runtimes.keys()) {
      await visit(name);
    }

    console.log(`[Runtime Manager] Topological load order resolved: [${order.join(" -> ")}]`);

    // Execute lifecycles sequentially matching the load order
    for (const name of order) {
      const runtime = this.runtimes.get(name);
      if (runtime) {
        console.log(`[Runtime Manager] Transitioning "${name}" to INITIALIZING...`);
        const mockContext = {
          services: {},
          eventBus: {},
          knowledgeGraph: {},
          runtimeManager: this
        };
        await runtime.initialize(mockContext);
        console.log(`[Runtime Manager] Transitioning "${name}" to LOADING...`);
        await runtime.load();
        console.log(`[Runtime Manager] Transitioning "${name}" to ACTIVE...`);
        await runtime.activate();
      }
    }

    return order;
  }

  public getRuntimeState(name: string): RuntimeState | "NOT_REGISTERED" {
    const runtime = this.runtimes.get(name);
    return runtime ? runtime.currentState : "NOT_REGISTERED";
  }
}

export const activeRuntimeManager = new RuntimeManager();
