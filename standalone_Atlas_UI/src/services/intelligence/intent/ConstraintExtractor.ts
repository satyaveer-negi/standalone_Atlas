import { CategorizedConstraint } from "./EngineeringIntent";

export class ConstraintExtractor {
  public extractConstraints(prompt: string): CategorizedConstraint[] {
    const constraints: CategorizedConstraint[] = [];
    
    // Parse target thresholds (e.g. "voltage > 115V", "temperature < 350K")
    if (prompt.toLowerCase().includes("voltage")) {
      constraints.push({
        id: "c-vol-1",
        name: "Voltage Lower Bound Limit",
        category: "Operational",
        expression: "gridVoltage > 115",
        limitValue: 115
      });
    }

    if (prompt.toLowerCase().includes("temperature")) {
      constraints.push({
        id: "c-temp-1",
        name: "Turbulence Safety Limit",
        category: "Safety",
        expression: "temperature < 350",
        limitValue: 350
      });
    }

    return constraints;
  }
}

export const activeConstraintExtractor = new ConstraintExtractor();
