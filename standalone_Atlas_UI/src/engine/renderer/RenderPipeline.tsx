import type { AtlasGraph } from "../../types/graph";

import EnvironmentLayer from "./layers/EnvironmentLayer";
import LightingLayer from "./layers/LightingLayer";
import ReactorLayer from "./layers/ReactorLayer";
import GridLayer from "./layers/GridLayer";
import ConnectionLayer from "./layers/ConnectionLayer";
import ArtifactLayer from "./layers/ArtifactLayer";
import ParticleLayer from "./layers/ParticleLayer";
import EffectLayer from "./layers/EffectLayer";
import SelectionLayer from "./layers/SelectionLayer";

import { useAtlasStore } from "../../store/atlasStore";

interface Props {
    graph: AtlasGraph;
}

export default function RenderPipeline({
    graph,
}: Props) {

    const hoveredNodeId =
        useAtlasStore(
            s => s.hoveredNodeId
        );

    const selectedNodeId =
        useAtlasStore(
            s => s.selectedNodeId
        );

    return (

        <>

            <EnvironmentLayer />

            <LightingLayer />

            <GridLayer />

            <ReactorLayer />

            <ConnectionLayer
                graph={graph}
                hoveredNodeId={hoveredNodeId}
                selectedNodeId={selectedNodeId}
            />

            <ArtifactLayer
                graph={graph}
                hoveredNodeId={hoveredNodeId}
                selectedNodeId={selectedNodeId}
            />

            <ParticleLayer />

            <EffectLayer />

            <SelectionLayer />

        </>

    );

}