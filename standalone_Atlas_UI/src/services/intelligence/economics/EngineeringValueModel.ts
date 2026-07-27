export type ValueCategory = 
  | "DirectSavings" 
  | "RiskReduction" 
  | "EfficiencyGain" 
  | "StrategicOptionality";

export interface ValueDimensions {
  financialValue: number;
  engineeringValue: number;
  organizationalValue: number;
  societalValue: number;
}

export interface EngineeringValueModel {
  valueModelId: string;
  title: string;
  scopeId: string;
  netPresentValue: number;
  internalRateOfReturn: number;
  paybackPeriodMonths: number;
  sustainabilityCredits: number;
  valueCategory: ValueCategory;
  valueDimensions: ValueDimensions;
  status: "Active" | "Closed";
}
