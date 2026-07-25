export interface EntityGeometry {
  meshFile?: string;
  cadFile?: string;
}

export interface TwinEntity {
  id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
  geometry?: EntityGeometry;
}
