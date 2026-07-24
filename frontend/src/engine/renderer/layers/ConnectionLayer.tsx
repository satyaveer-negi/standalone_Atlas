import { useMemo } from "react";

import type { AtlasGraph, AtlasNode } from "../../../types/graph";
import ConnectionBeam from "../../../components/effects/ConnectionBeam";

interface Props {
    graph: AtlasGraph;
    hoveredNodeId: string | null;
    selectedNodeId: string | null;
}

export default function ConnectionLayer({
    graph,
    hoveredNodeId,
    selectedNodeId,
}: Props) {
    const nodeMap = useMemo(
        () => new Map(graph.nodes.map((n) => [n.id, n])),
        [graph]
    );

    return (
        <>
            {graph.edges.map((edge) => {
                const source = nodeMap.get(edge.source);
                const target = nodeMap.get(edge.target);

                if (!source || !target) return null;

                const highlighted =
                    edge.source === hoveredNodeId ||
                    edge.target === hoveredNodeId ||
                    edge.source === selectedNodeId ||
                    edge.target === selectedNodeId;

                return (
                    <ConnectionBeam
                        key={edge.id}
                        source={source}
                        target={target}
                        highlighted={highlighted}
                    />
                );
            })}
        </>
    );
}