import { EngineeringIntent } from "../intent/EngineeringIntent";

export class IntentRepository {
  private intents = new Map<string, EngineeringIntent>();

  public saveIntent(intent: EngineeringIntent): void {
    this.intents.set(intent.id, intent);
    console.log(`[Intent Repository] Stored Intent: ${intent.goal} (${intent.id})`);
  }

  public getIntentsList(): EngineeringIntent[] {
    return Array.from(this.intents.values());
  }

  public clear(): void {
    this.intents.clear();
  }
}

export const activeIntentRepository = new IntentRepository();
