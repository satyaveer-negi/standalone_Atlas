import { EngineeringSituation } from "../runtime/EngineeringSituation";
import { CorrelatedSituation } from "../runtime/CorrelatedSituation";

export class EngineeringSituationRepository {
  private situations = new Map<string, EngineeringSituation>();
  private correlated = new Map<string, CorrelatedSituation>();

  public saveSituation(sit: EngineeringSituation): void {
    this.situations.set(sit.id, sit);
  }

  public saveCorrelated(corr: CorrelatedSituation): void {
    this.correlated.set(corr.id, corr);
  }

  public getSituationsList(): EngineeringSituation[] {
    return Array.from(this.situations.values());
  }

  public getCorrelatedList(): CorrelatedSituation[] {
    return Array.from(this.correlated.values());
  }

  public clear(): void {
    this.situations.clear();
    this.correlated.clear();
  }
}

export const activeEngineeringSituationRepository = new EngineeringSituationRepository();
