export interface ConstraintBoundary {
  propertyName: string;
  category: "Safety" | "Operational" | "Physical" | "Economic";
  limitValue: number;
}
