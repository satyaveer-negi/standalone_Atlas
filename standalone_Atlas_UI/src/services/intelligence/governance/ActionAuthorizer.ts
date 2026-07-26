import { EngineeringAction } from "./EngineeringAction";
import { AuthorizationStatus } from "./GovernanceDecision";

export class ActionAuthorizer {
  public resolveAuthorization(action: EngineeringAction): AuthorizationStatus {
    const isExtremeAnomaly = action.triggerSituation.twinSnapshot.temperature > 350;
    
    if (isExtremeAnomaly) {
      return "ApprovalRequired";
    }

    return "Approved";
  }
}

export const activeActionAuthorizer = new ActionAuthorizer();
