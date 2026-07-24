import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh, Group } from "three";
import type { DockerContainerNode } from "../../adapters/DockerAdapter";

interface Props {
  container: DockerContainerNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export function InfrastructureGeometry({
  container,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: Props) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const baseColor =
    container.status === "running"
      ? "#10b981"
      : container.status === "degraded"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <group
      ref={groupRef}
      position={container.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(container.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(container.id);
      }}
      onPointerOut={() => onHover(null)}
    >
      {/* 3D Container Hexagonal/Cube Box */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : baseColor}
          emissive={baseColor}
          emissiveIntensity={isSelected ? 2.5 : isHovered ? 1.8 : 1.2}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe Holographic Grid Surround */}
      <mesh>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshBasicMaterial color={baseColor} wireframe transparent opacity={0.4} />
      </mesh>

      {/* Label Badge */}
      <Html distanceFactor={18} position={[0, -1.1, 0]} center>
        <div
          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all pointer-events-none whitespace-nowrap shadow-md ${
            isSelected || isHovered
              ? "bg-emerald-500 text-slate-950 font-black border-emerald-300"
              : "bg-slate-950/80 text-emerald-300 border-emerald-500/40 backdrop-blur-xs"
          }`}
        >
          <span>🐳 {container.name}</span>
          <span className="ml-1.5 text-[8px] text-emerald-400">[{container.port}]</span>
        </div>
      </Html>
    </group>
  );
}
