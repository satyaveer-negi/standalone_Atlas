import { useFrame } from "@react-three/fiber";
import type { AtlasGraph } from "../../types/graph";

interface Props {
    graph: AtlasGraph;
}

export default function AnimationEngine({
    graph
}: Props) {

    useFrame((state) => {

        const t = state.clock.elapsedTime;

        graph.nodes.forEach(node => {

            switch (node.type) {

                case "task":

                    animateTask(node, t);
                    break;

                case "file":

                    animateFile(node, t);
                    break;

                case "version":

                    animateVersion(node, t);
                    break;

            }

        });

    });

    return null;

}

function animateTask(node: any, time: number) {

    node.position[1] =
        Math.sin(time * 2) * 0.15;

}

function animateFile(node: any, time: number) {

    node.position[1] =
        Math.sin(time * 3) * 0.08;

}

function animateVersion(node: any, time: number) {

    node.position[1] =
        0.25 +
        Math.sin(time * 4) * 0.04;

}