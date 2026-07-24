import { Float, MeshTransmissionMaterial, Text, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import type { EntityProps } from "../../types/entity";
import { useAtlasStore } from "../../store/atlasStore";

export default function ProjectCoreEntity({
    node,
}: EntityProps) {
    const ring = useRef<THREE.Mesh>(null!);
    const core = useRef<THREE.Mesh>(null!);

    const hoveredNodeId = useAtlasStore((s) => s.hoveredNodeId);
    const selectedNodeId = useAtlasStore((s) => s.selectedNodeId);

    const hovered = hoveredNodeId === node.id;
    const selected = selectedNodeId === node.id;

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        // Rotate energy ring
        ring.current.rotation.y += delta * 0.35;
        ring.current.rotation.x += delta * 0.18;

        // Rotate reactor
        core.current.rotation.y += delta * 0.15;
        core.current.rotation.z += delta * 0.08;

        // Pulse
        const targetScale = selected
            ? 1.25
            : hovered
                ? 1.15
                : 1 + Math.sin(t * 2.5) * 0.03;

        core.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.08
        );

        ring.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.08
        );
    });

    return (
        <Float speed={2} rotationIntensity={0.25} floatIntensity={0.4}>
            <group position={node.position}>
                {/* Quantum Core */}
                <mesh ref={core}>
                    <icosahedronGeometry args={[0.8, 4]} />

                    <MeshTransmissionMaterial
                        thickness={1.2}
                        roughness={0}
                        transmission={1}
                        chromaticAberration={0.4}
                        backside
                    />
                </mesh>

                {/* Energy Ring */}
                <Torus ref={ring} args={[1.3, 0.03, 32, 256]}>
                    <meshStandardMaterial
                        color="#00F5FF"
                        emissive="#00F5FF"
                        emissiveIntensity={selected ? 9 : hovered ? 7 : 5}
                        metalness={1}
                        roughness={0}
                    />
                </Torus>

                {/* Project Label */}
                <Text
                    position={[0, -1.4, 0]}
                    fontSize={0.22}
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