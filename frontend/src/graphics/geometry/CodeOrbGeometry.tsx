import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";
import type { GraphArtifactNode } from "../../engine/scene/SceneGraph";

interface Props {
  node: GraphArtifactNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export function CodeOrbGeometry({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: Props) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  const baseColor = node.color || "#34d399";

  return (
    <group
      position={node.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node.id);
      }}
      onPointerOut={() => onHover(null)}
    >
      {/* Function Energy Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : baseColor}
          emissive={baseColor}
          emissiveIntensity={isSelected ? 3.0 : isHovered ? 2.0 : 1.0}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Wireframe Aura */}
      <mesh>
        <sphereGeometry args={[0.45, 12, 12]} />
        <meshBasicMaterial
          color={baseColor}
          wireframe
          transparent
          opacity={isHovered ? 0.7 : 0.3}
        />
      </mesh>

      {/* Label Badge */}
      <Html distanceFactor={14} position={[0, -0.6, 0]} center>
        <div
          className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-all pointer-events-none whitespace-nowrap ${
            isSelected
              ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50"
              : "bg-slate-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs"
          }`}
        >
          <span>● {node.name}</span>
        </div>
      </Html>
    </group>
  );
}
