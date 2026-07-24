import { Float, MeshDistortMaterial, Sphere, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ProjectCore() {
    const outerRing = useRef<THREE.Mesh>(null!);
    const middleRing = useRef<THREE.Mesh>(null!);
    const innerRing = useRef<THREE.Mesh>(null!);
    const sphere = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        outerRing.current.rotation.y += delta * 0.35;
        outerRing.current.rotation.x += delta * 0.12;

        middleRing.current.rotation.x -= delta * 0.55;
        middleRing.current.rotation.z += delta * 0.18;

        innerRing.current.rotation.z += delta * 0.9;
        innerRing.current.rotation.y -= delta * 0.3;

        sphere.current.rotation.y += delta * 0.2;

        const s = 1 + Math.sin(t * 2.0) * 0.05;
        sphere.current.scale.set(s, s, s);
    });

    return (
        <Float
            speed={2}
            rotationIntensity={0.2}
            floatIntensity={0.6}
        >
            <group>

                {/* Outer Ring */}
                <Torus ref={outerRing} args={[2.8, 0.03, 16, 220]}>
                    <meshStandardMaterial
                        color="#00F5FF"
                        emissive="#00F5FF"
                        emissiveIntensity={4}
                    />
                </Torus>

                {/* Middle Ring */}
                <Torus
                    ref={middleRing}
                    rotation={[Math.PI / 2, 0, 0]}
                    args={[2.1, 0.025, 16, 200]}
                >
                    <meshStandardMaterial
                        color="#7B2FF7"
                        emissive="#7B2FF7"
                        emissiveIntensity={3}
                    />
                </Torus>

                {/* Inner Ring */}
                <Torus
                    ref={innerRing}
                    rotation={[0, Math.PI / 2, 0]}
                    args={[1.4, 0.02, 16, 180]}
                >
                    <meshStandardMaterial
                        color="#4CC9F0"
                        emissive="#4CC9F0"
                        emissiveIntensity={4}
                    />
                </Torus>

                {/* Core */}
                <Sphere ref={sphere} args={[0.75, 128, 128]}>
                    <MeshDistortMaterial
                        color="#4CC9F0"
                        emissive="#00F5FF"
                        emissiveIntensity={6}
                        roughness={0}
                        metalness={0.6}
                        speed={3}
                        distort={0.35}
                    />
                </Sphere>

            </group>
        </Float>
    );
}