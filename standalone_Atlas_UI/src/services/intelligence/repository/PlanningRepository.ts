import { PlanningResult } from "../planning/PlanningResult";

export class PlanningRepository {
  private history = new Map<string, PlanningResult>();

  public savePlanningResult(result: PlanningResult): void {
    this.history.set(result.intent.id, result);
    console.log(`[Planning Repository] Stored plan candidates evaluations for intent ${result.intent.id}`);
  }

  public getHistoryList(): PlanningResult[] {
    return Array.from(this.history.values());
  }

  public clear(): void {
    this.history.clear();
  }
}

export const activePlanningRepository = new PlanningRepository();
