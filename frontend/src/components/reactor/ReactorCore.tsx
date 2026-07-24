import { MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ReactorCore() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        ref.current.rotation.y += delta * 0.18;
        ref.current.rotation.z += delta * 0.08;

        const pulse =
            1 +
            Math.sin(state.clock.elapsedTime * 2.5) * 0.04;

        ref.current.scale.lerp(
            new THREE.Vector3(pulse, pulse, pulse),
            0.08
        );
    });

    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[0.9, 5]} />

            <MeshTransmissionMaterial
                transmission={1}
                thickness={1.5}
                roughness={0}
                chromaticAberration={0.3}
                backside
            />
        </mesh>
    );
}