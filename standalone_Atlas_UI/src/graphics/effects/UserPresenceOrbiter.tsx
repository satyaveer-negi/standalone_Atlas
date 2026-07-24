import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import type { GraphArtifactNode } from "../../engine/scene/SceneGraph";

export interface ActiveUserPresence {
  id: string;
  name: string;
  avatarColor: string;
  role: string;
  targetNodeId: string;
  isAIDrone?: boolean;
}

export const DEMO_USER_PRESENCES: ActiveUserPresence[] = [
  {
    id: "u1",
    name: "Sarah (Lead Dev)",
    avatarColor: "#ec4899",
    role: "FRONTEND",
    targetNodeId: "sys-frontend",
  },
  {
    id: "u2",
    name: "Alex (Backend Eng)",
    avatarColor: "#10b981",
    role: "DJANGO CORE",
    targetNodeId: "sys-backend",
  },
  {
    id: "u3",
    name: "AI Copilot Drone",
    avatarColor: "#3b82f6",
    role: "INSPECTION DRONE",
    targetNodeId: "repo-root",
    isAIDrone: true,
  },
];

interface Props {
  user: ActiveUserPresence;
  nodesMap: Map<string, GraphArtifactNode>;
}

export function UserPresenceOrbiter({ user, nodesMap }: Props) {
  const groupRef = useRef<Group>(null);
  const orbiterRef = useRef<Group>(null);
  const scanRingRef = useRef<Group>(null);

  const targetNode = nodesMap.get(user.targetNodeId);
  const basePosition: [number, number, number] = targetNode ? targetNode.position : [0, 0, 0];
  const targetName = targetNode ? targetNode.name : "Repository Core";

  // Attention & AI Drone Behavior Machine
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (orbiterRef.current) {
      if (user.isAIDrone) {
        // AI Drone: Sweeping inspection wave & hovering scan motion
        orbiterRef.current.position.x = Math.sin(t * 0.8) * 2.2;
        orbiterRef.current.position.z = Math.cos(t * 0.8) * 2.2;
        orbiterRef.current.position.y = Math.sin(t * 1.6) * 0.4;
      } else {
        // Human Attention Behavior: Moves, pauses while working, then adjusts focus
        const cycle = (Math.sin(t * 0.3) + 1) / 2; // Slow 0-1 cycle
        const radius = 2.4 + cycle * 0.5;
        orbiterRef.current.position.x = Math.cos(t * 0.2) * radius;
        orbiterRef.current.position.z = Math.sin(t * 0.2) * radius;
        orbiterRef.current.position.y = 0.2;
      }
    }

    if (scanRingRef.current && user.isAIDrone) {
      scanRingRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group ref={groupRef} position={basePosition}>
      {/* Visual Orbital Ring / Drone Scan Ring */}
      <group ref={scanRingRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.02, 16, 64]} />
          <meshBasicMaterial
            color={user.avatarColor}
            wireframeTransparent
            opacity={user.isAIDrone ? 0.6 : 0.3}
          />
        </mesh>
      </group>

      {/* Orbiting Avatar / AI Drone */}
      <group ref={orbiterRef}>
        {/* Presence Sphere / Drone Core */}
        <mesh>
          {user.isAIDrone ? (
            <octahedronGeometry args={[0.3, 0]} />
          ) : (
            <sphereGeometry args={[0.26, 16, 16]} />
          )}
          <meshStandardMaterial
            color={user.avatarColor}
            emissive={user.avatarColor}
            emissiveIntensity={user.isAIDrone ? 3.5 : 2.2}
            roughness={0.1}
          />
        </mesh>

        {/* Floating User / Drone Badge */}
        <Html distanceFactor={18} position={[0, 0.5, 0]} center>
          <div className="px-2.5 py-0.8 rounded-full bg-slate-950/95 border border-cyan-500/40 text-[9px] font-mono font-bold text-white shadow-xl flex items-center gap-1.5 whitespace-nowrap pointer-events-none">
            <span
              className="w-2 h-2 rounded-full animate-ping shrink-0"
              style={{ backgroundColor: user.avatarColor }}
            />
            <span>{user.name}</span>
            <span className="text-[8px] text-cyan-400 opacity-80">
              {user.isAIDrone ? `[scanning: ${targetName}]` : `[focus: ${targetName}]`}
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
}
