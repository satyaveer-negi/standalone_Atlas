export type RelationshipType =
  | "Electrical"
  | "Mechanical"
  | "Thermal"
  | "Fluid"
  | "Communication"
  | "Control"
  | "Dependency"
  | "Custom";

export interface TwinRelationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: RelationshipType;
  metadata?: Record<string, any>;
}
