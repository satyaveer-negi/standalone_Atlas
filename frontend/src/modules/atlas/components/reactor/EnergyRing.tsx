import { Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface Props {
    radius: number;
    speed: number;
    axis: "x" | "y" | "z";
    color?: string;
}

export default function EnergyRing({
    radius,
    speed,
    axis,
    color = "#00F5FF",
}: Props) {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((_, delta) => {
        ref.current.rotation[axis] += delta * speed;
    });

    return (
        <Torus
            ref={ref}
            args={[radius, 0.03, 32, 180]}
        >
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={5}
                metalness={1}
                roughness={0}
            />
        </Torus>
    );
}