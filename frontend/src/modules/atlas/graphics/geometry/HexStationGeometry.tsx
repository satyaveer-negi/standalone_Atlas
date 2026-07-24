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

export function HexStationGeometry({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: Props) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const baseColor = node.color || "#06b6d4";

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
      {/* Hexagonal Prism Station */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.7, 0.7, 0.3, 6]} />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : baseColor}
          emissive={baseColor}
          emissiveIntensity={isSelected ? 2.0 : isHovered ? 1.5 : 0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Hex Wireframe Boundary */}
      <mesh>
        <cylinderGeometry args={[0.85, 0.85, 0.35, 6]} />
        <meshBasicMaterial
          color={baseColor}
          wireframe
          transparent
          opacity={isHovered ? 0.6 : 0.25}
        />
      </mesh>

      {/* Label Badge */}
      <Html distanceFactor={20} position={[0, -1.1, 0]} center>
        <div
          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all pointer-events-none whitespace-nowrap ${
            isSelected
              ? "bg-cyan-500/90 text-slate-950 border-cyan-300"
              : "bg-slate-950/80 text-cyan-300 border-cyan-500/30 backdrop-blur-xs"
          }`}
        >
          <span>⬡ {node.name}</span>
        </div>
      </Html>
    </group>
  );
}
