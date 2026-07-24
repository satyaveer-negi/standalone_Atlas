import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import type { ProtocolType } from "../../engine/animation/AnimationDirector";

interface Props {
  protocol: ProtocolType;
  from: [number, number, number];
  to: [number, number, number];
  label: string;
  onComplete?: () => void;
}

const PROTOCOL_CONFIG: Record<
  ProtocolType,
  { color: string; symbol: string; shape: "sphere" | "octahedron" | "tetrahedron" | "torus" }
> = {
  HTTP: { color: "#00f0ff", symbol: "●", shape: "sphere" },
  SQL: { color: "#10b981", symbol: "◆", shape: "octahedron" },
  Redis: { color: "#f59e0b", symbol: "⚡", shape: "tetrahedron" },
  WebSocket: { color: "#a855f7", symbol: "≈", shape: "torus" },
  AI: { color: "#ffffff", symbol: "✦", shape: "sphere" },
};

export function ProtocolPacket({ protocol, from, to, label, onComplete }: Props) {
  const groupRef = useRef<Group>(null);
  const progressRef = useRef(0);

  const config = PROTOCOL_CONFIG[protocol] || PROTOCOL_CONFIG.HTTP;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    progressRef.current += delta * 0.7; // Smooth 1.4s event transit
    if (progressRef.current >= 1) {
      if (onComplete) onComplete();
      return;
    }

    const fromVec = new THREE.Vector3(...from);
    const toVec = new THREE.Vector3(...to);

    const currentPos = new THREE.Vector3().lerpVectors(fromVec, toVec, progressRef.current);
    // Smooth arc curve
    currentPos.y += Math.sin(progressRef.current * Math.PI) * 1.4;

    groupRef.current.position.copy(currentPos);
  });

  return (
    <group ref={groupRef} position={from}>
      {/* Dynamic Protocol Shape */}
      <mesh>
        {config.shape === "octahedron" && <octahedronGeometry args={[0.35, 0]} />}
        {config.shape === "tetrahedron" && <tetrahedronGeometry args={[0.35, 0]} />}
        {config.shape === "torus" && <torusGeometry args={[0.3, 0.08, 16, 32]} />}
        {config.shape === "sphere" && <sphereGeometry args={[0.3, 16, 16]} />}

        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={3.5}
          roughness={0.1}
        />
      </mesh>

      {/* Floating Protocol Label Badge */}
      <Html distanceFactor={16} position={[0, 0.5, 0]} center>
        <div
          className="px-2 py-0.5 rounded-full bg-slate-950/95 border text-[9px] font-mono font-bold shadow-2xl flex items-center gap-1 whitespace-nowrap pointer-events-none"
          style={{ borderColor: config.color, color: config.color }}
        >
          <span>{config.symbol}</span>
          <span>{label}</span>
        </div>
      </Html>
    </group>
  );
}
