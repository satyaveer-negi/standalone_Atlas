import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { EntityProps } from "../../types/entity";

export default function FileEntity({
    node,
    selected = false,
    hovered = false,
}: EntityProps) {
    const crystal = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        // Crystal rotation
        crystal.current.rotation.x += delta * 0.6;
        crystal.current.rotation.y += delta * 0.9;
        crystal.current.rotation.z += delta * 0.3;

        // Smooth scale animation
        const targetScale = selected
            ? 1.25
            : hovered
                ? 1.15
                : 1 + Math.sin(t * 3) * 0.04;

        crystal.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.08
        );
    });

    return (
        <Float
            speed={3}
            floatIntensity={0.7}
            rotationIntensity={0.15}
        >
            <group position={node.position}>
                <mesh ref={crystal}>
                    <octahedronGeometry args={[0.22]} />

                    <meshStandardMaterial
                        color="#4CC9F0"
                        emissive="#00F5FF"
                        emissiveIntensity={
                            selected
                                ? 8
                                : hovered
                                    ? 6
                                    : 4
                        }
                        metalness={1}
                        roughness={0.08}
                    />
                </mesh>

                <Text
                    position={[0, 0.42, 0]}
                    fontSize={0.10}
                    maxWidth={1.2}
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