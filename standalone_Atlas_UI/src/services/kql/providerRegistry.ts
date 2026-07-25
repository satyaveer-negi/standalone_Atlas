import { QueryProvider, RegistryQueryProvider, RuntimeQueryProvider, TraceQueryProvider } from "./queryProvider";

export class QueryProviderRegistry {
  private static instance: QueryProviderRegistry;
  private providers = new Map<string, QueryProvider<any>>();

  private constructor() {
    this.registerProvider(new RegistryQueryProvider());
    this.registerProvider(new RuntimeQueryProvider());
    this.registerProvider(new TraceQueryProvider());
  }

  public static getInstance(): QueryProviderRegistry {
    if (!QueryProviderRegistry.instance) {
      QueryProviderRegistry.instance = new QueryProviderRegistry();
    }
    return QueryProviderRegistry.instance;
  }

  public registerProvider(provider: QueryProvider<any>): void {
    console.log(`[KQL Registry] Registering Query Provider for entity: "${provider.entityName}"`);
    this.providers.set(provider.entityName.toUpperCase(), provider);
  }

  public resolveProvider(entityName: string): QueryProvider<any> {
    const provider = this.providers.get(entityName.toUpperCase());
    if (!provider) {
      throw new Error(`[KQL Registry] No Query Provider registered for target entity: "${entityName}"`);
    }
    return provider;
  }
}

export const queryProviderRegistry = QueryProviderRegistry.getInstance();
