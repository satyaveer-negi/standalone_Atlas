import type { AtlasNode } from "../../../types/graph";

export function orbit(

    node: AtlasNode,

    center: [number, number, number],

    radius: number,

    speed: number,

    time: number

) {

    node.position = [

        center[0] +
        Math.cos(time * speed) * radius,

        node.position[1],

        center[2] +
        Math.sin(time * speed) * radius

    ];

}