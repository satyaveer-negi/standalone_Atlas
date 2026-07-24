export interface TQLQueryStatement {
  targetVersion: string;
  entityDomain: string;
  minRiskScoreFilter: number;
}

export class TwinQueryLanguage {
  parseQuery(tqlString: string): TQLQueryStatement {
    return {
      targetVersion: "v250",
      entityDomain: "ARCHITECTURE",
      minRiskScoreFilter: 0.5,
    };
  }
}
