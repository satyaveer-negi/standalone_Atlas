export interface ObjectiveTerm {
  propertyName: string;
  mode: "Maximize" | "Minimize" | "Target";
  weight: number;
}
