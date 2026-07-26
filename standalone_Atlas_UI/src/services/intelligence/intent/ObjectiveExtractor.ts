import { OptimizationObjective } from "./EngineeringIntent";

export class ObjectiveExtractor {
  public extractObjectives(tokens: string[]): OptimizationObjective[] {
    const objectives: OptimizationObjective[] = [];

    if (tokens.includes("solar") || tokens.includes("yield")) {
      objectives.push({
        id: "obj-sol-1",
        propertyName: "solarOutput",
        mode: "Maximize",
        weight: 0.7
      });
    }

    if (tokens.includes("drag") || tokens.includes("aerodynamics")) {
      objectives.push({
        id: "obj-drag-1",
        propertyName: "meshOrthogonality",
        mode: "Maximize",
        weight: 0.8
      });
    }

    return objectives;
  }
}

export const activeObjectiveExtractor = new ObjectiveExtractor();
