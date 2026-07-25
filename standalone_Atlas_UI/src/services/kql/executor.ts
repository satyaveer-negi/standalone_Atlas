import { KQLPlan } from "./planner";
import { queryProviderRegistry } from "./providerRegistry";

export class KQLExecutor {
  public async executePlan(plan: KQLPlan): Promise<any[]> {
    console.log(`[KQL Executor] Resolving query execution via Provider: "${plan.providerKey}"`);
    const provider = queryProviderRegistry.resolveProvider(plan.providerKey);
    return await provider.execute(plan.criteria);
  }
}

export const activeKQLExecutor = new KQLExecutor();
