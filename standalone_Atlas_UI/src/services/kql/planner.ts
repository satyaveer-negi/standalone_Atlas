import { QueryCriteria, queryProviderRegistry } from "./providerRegistry";

export interface KQLPlan {
  providerKey: string;
  criteria: QueryCriteria;
}

export class KQLPlanner {
  public buildPlan(entityName: string, queryConditions: string): KQLPlan {
    const criteria: QueryCriteria = {};

    if (queryConditions.toUpperCase().includes("CERTIFICATION = GOLD")) {
      criteria.filters = { quality: "Gold" };
    } else if (queryConditions.toUpperCase().includes("CERTIFICATION = PLATINUM")) {
      criteria.filters = { quality: "Platinum" };
    }

    // Verify provider is registered
    const provider = queryProviderRegistry.resolveProvider(entityName);

    return {
      providerKey: provider.entityName,
      criteria,
    };
  }
}

export const activeKQLPlanner = new KQLPlanner();
