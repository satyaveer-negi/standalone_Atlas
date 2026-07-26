import { EngineeringAction } from "./EngineeringAction";

export type InterlockCategory = "Preventive" | "Protective" | "Emergency" | "Recovery";
export type InterlockLevel = "SoftWarning" | "Protected" | "Locked" | "EmergencyShutdown";

export interface InterlockState {
  category: InterlockCategory;
  level: InterlockLevel;
  engaged: boolean;
  message: string;
}

export class SafetyInterlock {
  public evaluateInterlocks(action: EngineeringAction): InterlockState {
    const temp = action.triggerSituation.twinSnapshot.temperature;
    
    if (temp > 350) {
      return {
        category: "Emergency",
        level: "EmergencyShutdown",
        engaged: true,
        message: `Safety Interlock Engaged: Overheat emergency shut-down limit crossed (${temp}°C > 350°C)`
      };
    } else if (temp > 330) {
      return {
        category: "Preventive",
        level: "SoftWarning",
        engaged: false,
        message: "Soft temperature limit warning active."
      };
    }

    return {
      category: "Protective",
      level: "Protected",
      engaged: false,
      message: "Safety limits checking nominal."
    };
  }
}

export const activeSafetyInterlock = new SafetyInterlock();
