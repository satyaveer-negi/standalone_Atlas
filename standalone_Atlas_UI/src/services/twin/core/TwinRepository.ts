import { DigitalTwin } from "./DigitalTwin";

export class TwinRepository {
  private twinsMap = new Map<string, DigitalTwin>();

  public createTwin(id: string, name: string, domain: string): DigitalTwin {
    const twin = new DigitalTwin(id, name, domain);
    this.twinsMap.set(id, twin);
    return twin;
  }

  public getTwin(id: string): DigitalTwin | null {
    return this.twinsMap.get(id) ?? null;
  }

  public getTwinsList(): DigitalTwin[] {
    return Array.from(this.twinsMap.values());
  }

  public deleteTwin(id: string): boolean {
    return this.twinsMap.delete(id);
  }

  public clear(): void {
    this.twinsMap.clear();
  }
}

export const activeTwinRepository = new TwinRepository();
