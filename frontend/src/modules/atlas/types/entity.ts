import type { AtlasNode } from "./graph";

export interface EntityProps {
    node: AtlasNode;
    selected?: boolean;
    hovered?: boolean;
}