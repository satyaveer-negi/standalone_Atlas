import { Float, Text, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { EntityProps } from "../../types/entity";
import { useAtlasStore } from "../../store/atlasStore";

export default function SprintEntity({
    node,
}: EntityProps) {
    const ring = useRef<THREE.Mesh>(null!);

    const hoveredNodeId = useAtlasStore((s) => s.hoveredNodeId);
    const selectedNodeId = useAtlasStore((s) => s.selectedNodeId);

    const hovered = hoveredNodeId === node.id;
    const selected = selectedNodeId === node.id;

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        ring.current.rotation.y += delta * 0.45;
        ring.current.rotation.x += delta * 0.15;

        const targetScale = selected
            ? 1.18
            : hovered
                ? 1.10
                : 1 + Math.sin(t * 2.5) * 0.03;

        ring.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.08
        );
    });

    return (
        <Float
            speed={2}
            floatIntensity={0.4}
            rotationIntensity={0.15}
        >
            <group position={node.position}>
                <Torus
                    ref={ring}
                    args={[0.8, 0.05, 24, 180]}
                >
                    <meshStandardMaterial
                        color="#00F5FF"
                        emissive="#00F5FF"
                        emissiveIntensity={
                            selected
                                ? 9
                                : hovered
                                    ? 7
                                    : 5
                        }
                        metalness={1}
                        roughness={0.15}
                    />
                </Torus>

                <Text
                    position={[0, 0.9, 0]}
                    fontSize={0.18}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {node.name}
                </Text>
            </group>
        </Float>
    );
}