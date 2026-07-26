import { EngineeringExperience } from "./EngineeringExperience";

export interface ExperienceSearchQuery {
  intentGoalKeywords?: string[];
  domainName?: string;
  failureMode?: string;
}

export class ExperienceIndexer {
  private indexList: EngineeringExperience[] = [];

  public indexExperience(exp: EngineeringExperience): void {
    this.indexList.push(exp);
    console.log(`[Experience Indexer] Indexed project ${exp.projectName} (Outcome: ${exp.outcomeStatus})`);
  }

  public search(query: ExperienceSearchQuery): EngineeringExperience[] {
    return this.indexList.filter(exp => {
      if (query.intentGoalKeywords && query.intentGoalKeywords.length > 0) {
        const matches = query.intentGoalKeywords.some(kw => 
          exp.intent.goal.toLowerCase().includes(kw.toLowerCase())
        );
        if (!matches) return false;
      }

      if (query.domainName && exp.projectName.toLowerCase() !== query.domainName.toLowerCase()) {
        return false;
      }

      if (query.failureMode && exp.outcomeStatus !== "Failure") {
        return false;
      }

      return true;
    });
  }

  public getAll(): EngineeringExperience[] {
    return this.indexList;
  }
}

export const activeExperienceIndexer = new ExperienceIndexer();
