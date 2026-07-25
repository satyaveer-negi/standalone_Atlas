export interface Variable {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "object";
  unit: string;
  value: any;
  producerAgent?: string;
  timestamp: string;
}
