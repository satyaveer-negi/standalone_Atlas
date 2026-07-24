import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh, Group } from "three";
import type { GraphArtifactNode } from "../../engine/scene/SceneGraph";
import { AnimationDirector } from "../../engine/animation/AnimationDirector";
import type { ArtifactBehaviorState } from "../../engine/animation/AnimationDirector";

interface Props {
  node: GraphArtifactNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export function ProjectReactorGeometry({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: Props) {
  const groupRef = useRef<Group>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);

  const behaviorState: ArtifactBehaviorState = isSelected
    ? "Selected"
    : isHovered
    ? "Hovered"
    : AnimationDirector.getNodeState(node.id);

  // Behavioral State Machine Color & Emissive Logic
  let stateColor = node.color || "#00f0ff";
  let emissiveIntensity = 1.2;
  let rotationSpeedMultiplier = 1.0;

  if (behaviorState === "Executing") {
    stateColor = "#38bdf8";
    emissiveIntensity = 3.2;
    rotationSpeedMultiplier = 2.5;
  } else if (behaviorState === "Error") {
    stateColor = "#ef4444";
    emissiveIntensity = 3.5;
    rotationSpeedMultiplier = 3.0;
  } else if (behaviorState === "Success") {
    stateColor = "#10b981";
    emissiveIntensity = 2.8;
  } else if (behaviorState === "Selected") {
    stateColor = "#ffffff";
    emissiveIntensity = 2.5;
  } else if (behaviorState === "Hovered") {
    emissiveIntensity = 2.0;
  } else {
    // Calm Idle State: Gentle Breathing
    emissiveIntensity = 1.0;
    rotationSpeedMultiplier = 0.5;
  }

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15 * rotationSpeedMultiplier;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.3 * rotationSpeedMultiplier;
      ring1Ref.current.rotation.z += delta * 0.2 * rotationSpeedMultiplier;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.4 * rotationSpeedMultiplier;
    }
  });

  return (
    <group
      ref={groupRef}
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
      {/* Central Glowing Arc Reactor Core */}
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial
          color={stateColor}
          emissive={stateColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Outer Rotating Energy Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.05, 16, 64]} />
        <meshBasicMaterial color={stateColor} wireframeTransparent opacity={0.7} />
      </mesh>

      {/* Outer Rotating Energy Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.03, 16, 64]} />
        <meshBasicMaterial color="#a855f7" wireframeTransparent opacity={0.5} />
      </mesh>

      {/* Minimal Label Badge */}
      <Html distanceFactor={18} position={[0, -2.2, 0]} center>
        <div
          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all pointer-events-none whitespace-nowrap shadow-md ${
            isSelected || isHovered
              ? "bg-cyan-500/90 text-slate-950 border-cyan-300 font-black shadow-cyan-500/50"
              : "bg-slate-950/70 text-cyan-300 border-cyan-500/30 backdrop-blur-xs"
          }`}
        >
          <span>{isHovered || isSelected ? `⭐ REPO CORE: ${node.name}` : `⭐ REPO CORE`}</span>
        </div>
      </Html>
    </group>
  );
}
