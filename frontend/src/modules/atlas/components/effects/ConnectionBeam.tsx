import { QuadraticBezierLine } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import DataPacketEmitter from "./DataPacketEmitter";
import type { AtlasNode } from "../../types/graph";

interface ConnectionBeamProps {
    source: AtlasNode;
    target: AtlasNode;
    highlighted?: boolean;
}

export default function ConnectionBeam({
    source,
    target,
    highlighted = false,
}: ConnectionBeamProps) {
    const ref = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (!ref.current) return;

        const t = state.clock.elapsedTime;

        const targetScale = highlighted
            ? 1.2
            : 1 + Math.sin(t * 3) * 0.05;

        ref.current.scale.lerp(
            new THREE.Vector3(
                targetScale,
                targetScale,
                targetScale
            ),
            0.08
        );
    });

    const color = highlighted
        ? "#7B2FF7"
        : "#00F5FF";

    return (
        <group ref={ref}>
            <QuadraticBezierLine
                start={source.position}
                end={target.position}
                mid={[
                    (source.position[0] + target.position[0]) / 2,
                    Math.max(source.position[1], target.position[1]) + 1,
                    (source.position[2] + target.position[2]) / 2,
                ]}
                color={color}
                lineWidth={highlighted ? 3 : 2}
            />

            <DataPacketEmitter

                source={source}

                target={target}

            />
        </group>
    );
}