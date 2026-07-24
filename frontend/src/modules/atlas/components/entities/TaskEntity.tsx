import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { EntityProps } from "../../types/entity";

export default function TaskEntity({
    node,
    selected = false,
    hovered = false,
}: EntityProps) {
    const taskRef = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        // Slow rotation
        taskRef.current.rotation.y += delta * 0.45;
        taskRef.current.rotation.x =
            Math.sin(t * 0.8) * 0.08;

        // Smooth scaling
        const targetScale = selected
            ? 1.25
            : hovered
                ? 1.15
                : 1 + Math.sin(t * 2.5) * 0.03;

        taskRef.current.scale.lerp(
            new THREE.Vector3(
                targetScale,
                targetScale,
                targetScale
            ),
            0.08
        );
    });

    return (
        <Float
            speed={2}
            floatIntensity={0.5}
            rotationIntensity={0.15}
        >
            <group position={node.position}>
                <mesh ref={taskRef}>
                    {/* Hexagonal task pod */}
                    <cylinderGeometry
                        args={[0.5, 0.5, 0.18, 6]}
                    />

                    <meshStandardMaterial
                        color="#111827"
                        emissive="#7B2FF7"
                        emissiveIntensity={
                            selected
                                ? 8
                                : hovered
                                    ? 6
                                    : 4
                        }
                        metalness={1}
                        roughness={0.15}
                    />
                </mesh>

                <Text
                    position={[0, 0.58, 0]}
                    fontSize={0.15}
                    maxWidth={1.5}
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