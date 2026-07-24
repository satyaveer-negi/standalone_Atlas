import type { AtlasGraph } from "../../types/graph";
import { useAtlasStore } from "../../store/atlasStore";

import ConnectionLayer from "./layers/ConnectionLayer";
import EntityLayer from "./layers/EntityLayer";

interface Props {
    graph: AtlasGraph;
}

export default function EntityRenderer({
    graph,
}: Props) {
    const hoveredNodeId = useAtlasStore(
        (s) => s.hoveredNodeId
    );

    const selectedNodeId = useAtlasStore(
        (s) => s.selectedNodeId
    );

    return (
        <>
            {/* Connection Pass */}

            <ConnectionLayer
                graph={graph}
                hoveredNodeId={hoveredNodeId}
                selectedNodeId={selectedNodeId}
            />

            {/* Entity Pass */}

            <EntityLayer
                graph={graph}
                hoveredNodeId={hoveredNodeId}
                selectedNodeId={selectedNodeId}
            />
        </>
    );
}