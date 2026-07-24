export type AtlasNodeType =
    | "project"
    | "sprint"
    | "task"
    | "file"
    | "version"
    | "branch"
    | "commit"
    | "docker"
    | "api"
    | "database";

export interface AtlasNode {

    id: string;

    type: AtlasNodeType;

    name: string;

    position: [number, number, number];

    parent?: string;

    data?: any;

}

export interface AtlasEdge {

    id: string;

    source: string;

    target: string;

}

export interface AtlasGraph {

    nodes: AtlasNode[];

    edges: AtlasEdge[];

}