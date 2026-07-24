import { useFrame } from "@react-three/fiber";
import { useMemo, useState } from "react";

import type { AtlasNode } from "../../types/graph";

import DataPacket from "./DataPacket";

interface Props {

    source: AtlasNode;

    target: AtlasNode;

}

export default function DataPacketEmitter({

    source,

    target

}: Props) {

    const [offset, setOffset] = useState(0);

    useFrame((_, delta) => {

        setOffset(v => (v + delta * 0.35) % 1);

    });

    const packets = useMemo(

        () => [0, .25, .5, .75],

        []

    );

    return (

        <>

            {packets.map((packet, index) => {

                const t = (packet + offset) % 1;

                const x =

                    source.position[0] +

                    (target.position[0] - source.position[0]) * t;

                const y =

                    source.position[1] +

                    (target.position[1] - source.position[1]) * t;

                const z =

                    source.position[2] +

                    (target.position[2] - source.position[2]) * t;

                return (

                    <DataPacket

                        key={index}

                        position={[x, y, z]}

                    />

                );

            })}

        </>

    );

}