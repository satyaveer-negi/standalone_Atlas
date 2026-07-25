export type ConflictResolutionPolicy = "LatestVersion" | "HighestConfidence" | "ObservedWins";

export class ConflictResolver {
  public resolveConflict(
    val1: any,
    ver1: number,
    conf1: number,
    prov1: string,
    val2: any,
    ver2: number,
    conf2: number,
    prov2: string,
    policy: ConflictResolutionPolicy
  ): any {
    if (policy === "LatestVersion") {
      return ver1 >= ver2 ? val1 : val2;
    }
    if (policy === "HighestConfidence") {
      return conf1 >= conf2 ? val1 : val2;
    }
    if (policy === "ObservedWins") {
      if (prov1 === "Observed") return val1;
      if (prov2 === "Observed") return val2;
      return ver1 >= ver2 ? val1 : val2;
    }
    return val1;
  }
}

export const activeConflictResolver = new ConflictResolver();
