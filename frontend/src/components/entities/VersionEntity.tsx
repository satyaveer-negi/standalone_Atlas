import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { EntityProps } from "../../types/entity";

export default function VersionEntity({
    node,
    selected = false,
    hovered = false,
}: EntityProps) {
    const ref = useRef<THREE.Mesh>(null!);

    const latest = Boolean(node.data?.is_latest);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        ref.current.rotation.x += delta * 2.0;
        ref.current.rotation.y += delta * 1.5;
        ref.current.rotation.z += delta * 1.2;

        const targetScale = selected
            ? 1.45
            : hovered
                ? 1.25
                : 1 + Math.sin(t * 5) * 0.08;

        ref.current.scale.lerp(
            new THREE.Vector3(
                targetScale,
                targetScale,
                targetScale
            ),
            0.1
        );
    });

    return (
        <Float
            speed={4}
            floatIntensity={0.8}
            rotationIntensity={0.2}
        >
            <group position={node.position}>
                <mesh ref={ref}>
                    <tetrahedronGeometry args={[0.08]} />

                    <meshStandardMaterial
                        color={latest ? "#00E676" : "#00F5FF"}
                        emissive={latest ? "#00E676" : "#00F5FF"}
                        emissiveIntensity={
                            selected
                                ? 10
                                : hovered
                                    ? 8
                                    : 6
                        }
                        metalness={1}
                        roughness={0}
                    />
                </mesh>

                <Text
                    position={[0, 0.18, 0]}
                    fontSize={0.05}
                    anchorX="center"
                    anchorY="middle"
                    color="white"
                >
                    {node.name}
                </Text>
            </group>
        </Float>
    );
}