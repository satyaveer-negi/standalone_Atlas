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

export function ModuleCrystalGeometry({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: Props) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  const baseColor = node.color || "#38bdf8";

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
      {/* Crystal Polyhedron */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshPhysicalMaterial
          color={isSelected ? "#ffffff" : baseColor}
          emissive={baseColor}
          emissiveIntensity={isSelected ? 2.5 : isHovered ? 1.8 : 0.8}
          roughness={0.1}
          metalness={0.2}
          transmission={0.6}
          thickness={0.8}
        />
      </mesh>

      {/* Outer Halo */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color={baseColor}
          wireframe
          transparent
          opacity={isHovered ? 0.35 : 0.15}
        />
      </mesh>

      {/* Label Badge */}
      <Html distanceFactor={22} position={[0, -1.5, 0]} center>
        <div
          className={`px-2.5 py-0.8 rounded-lg text-[11px] font-mono font-bold border transition-all pointer-events-none whitespace-nowrap shadow-md ${
            isSelected
              ? "bg-purple-500/90 text-white border-purple-300"
              : "bg-slate-950/80 text-purple-300 border-purple-500/30 backdrop-blur-sm"
          }`}
        >
          <span>◇ {node.name}</span>
        </div>
      </Html>
    </group>
  );
}
