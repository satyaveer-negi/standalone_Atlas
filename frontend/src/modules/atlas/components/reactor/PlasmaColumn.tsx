import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function PlasmaColumn() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const pulse =
            1 +
            Math.sin(state.clock.elapsedTime * 4) * 0.08;

        ref.current.scale.y = pulse;
    });

    return (
        <mesh ref={ref} position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 3]} />

            <meshStandardMaterial
                color="#00F5FF"
                emissive="#00F5FF"
                emissiveIntensity={8}
                transparent
                opacity={0.7}
            />
        </mesh>
    );
}