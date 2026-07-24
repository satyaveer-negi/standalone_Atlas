import type { AtlasGraph } from "../../../types/graph";

import EntityFactory from "../EntityFactory";

interface Props {
    graph: AtlasGraph;
    hoveredNodeId: string | null;
    selectedNodeId: string | null;
}

export default function EntityLayer({
    graph,
    hoveredNodeId,
    selectedNodeId,
}: Props) {
    return (
        <>
            {graph.nodes.map((node) => (
                <EntityFactory
                    key={node.id}
                    node={node}
                    hovered={hoveredNodeId === node.id}
                    selected={selectedNodeId === node.id}
                />
            ))}
        </>
    );
}