export type AtlasNodeType =
    | "project"
    | "sprint"
    | "task"
    | "file"
    | "version";

export interface AtlasNode {

    id: string;

    parent?: string;

    type: AtlasNodeType;

    name: string;

    position: [number, number, number];

    data?: unknown;

}

export interface AtlasEdge {

    id: string;

    source: string;

    target: string;

}