export type PatchCommandType =
  | "CreateArtifact"
  | "UpdateArtifact"
  | "RemoveArtifact"
  | "ConnectArtifacts"
  | "FocusArtifact";

export interface CreateArtifactPatch {
  command: "CreateArtifact";
  artifactId: string;
  artifactType: string;
  name: string;
  position: [number, number, number];
  metadata?: Record<string, any>;
}

export interface UpdateArtifactPatch {
  command: "UpdateArtifact";
  artifactId: string;
  changes: Record<string, any>;
}

export interface RemoveArtifactPatch {
  command: "RemoveArtifact";
  artifactId: string;
}

export interface ConnectArtifactsPatch {
  command: "ConnectArtifacts";
  connectionId: string;
  sourceId: string;
  targetId: string;
  relation: string;
}

export type ScenePatch =
  | CreateArtifactPatch
  | UpdateArtifactPatch
  | RemoveArtifactPatch
  | ConnectArtifactsPatch;
