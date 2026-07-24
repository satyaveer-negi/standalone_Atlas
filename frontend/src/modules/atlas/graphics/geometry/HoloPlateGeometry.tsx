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

export function HoloPlateGeometry({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: Props) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 2 + node.position[0]) * 0.08;
    }
  });

  const getHealthBorder = () => {
    switch (node.health) {
      case "error":
        return "border-red-500 shadow-red-500/50 text-red-300";
      case "frequent":
        return "border-amber-500 shadow-amber-500/50 text-amber-300";
      case "complex":
        return "border-purple-500 shadow-purple-500/50 text-purple-300";
      case "modified":
        return "border-white shadow-white/50 text-white";
      default:
        return "border-cyan-500/40 text-cyan-300";
    }
  };

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
      {/* Floating Plate Mesh */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.2, 0.7, 0.04]} />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : node.color || "#38bdf8"}
          emissive={node.color || "#38bdf8"}
          emissiveIntensity={isSelected ? 2.0 : isHovered ? 1.4 : 0.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Holographic Plate UI Overlay */}
      <Html distanceFactor={18} position={[0, 0, 0.05]} center>
        <div
          className={`px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border text-xs font-mono font-bold shadow-xl flex flex-col gap-0.5 transition-all pointer-events-none ${getHealthBorder()}`}
        >
          <div className="flex items-center gap-1.5 justify-between">
            <span className="truncate max-w-[120px]">▭ {node.name}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
              Score: {node.aiMetadata.complexityScore}
            </span>
          </div>
          {node.gitActivity && (
            <span className="text-[9px] text-slate-400 font-normal">
              Modified: {node.gitActivity.lastModified}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}
