import { TwinQueryLanguage } from "./TwinQueryLanguage";
import type { TwinEntity } from "./CanonicalTwinSchema";

export class TwinQueryEngine {
  private tqlParser = new TwinQueryLanguage();

  executeQuery(tqlString: string, entities: TwinEntity[]): TwinEntity[] {
    const parsed = this.tqlParser.parseQuery(tqlString);
    return entities.filter((e) => e.riskScore >= parsed.minRiskScoreFilter);
  }
}
