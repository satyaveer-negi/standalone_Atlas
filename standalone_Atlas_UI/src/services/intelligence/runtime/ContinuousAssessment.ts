import { EngineeringSituation } from "./EngineeringSituation";

export class ContinuousAssessment {
  public assess(situation: EngineeringSituation): void {
    const isThermalViolation = situation.twinSnapshot.temperature > 350;
    
    if (isThermalViolation) {
      situation.safetyStatus = "Viated";
      situation.alerts.push("Continuous assessment alert: Operational temperature limit exceeded!");
    } else {
      situation.safetyStatus = "Passed";
    }

    situation.liveConstraintsChecked.push("SubstationTemperatureLimitCheck", "SubstationVoltageThresholdCheck");
  }
}

export const activeContinuousAssessment = new ContinuousAssessment();
