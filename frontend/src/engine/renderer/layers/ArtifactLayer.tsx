import type { AtlasGraph } from "../../../types/graph";

import ArtifactFactory from "../ArtifactFactory";

interface Props {

    graph: AtlasGraph;

    hoveredNodeId: string | null;

    selectedNodeId: string | null;

}

export default function ArtifactLayer({

    graph,

    hoveredNodeId,

    selectedNodeId

}: Props) {

    return (

        <>

            {graph.nodes.map(node => (

                <ArtifactFactory

                    key={node.id}

                    node={node}

                    hovered={
                        hoveredNodeId === node.id
                    }

                    selected={
                        selectedNodeId === node.id
                    }

                />

            ))}

        </>

    );

}