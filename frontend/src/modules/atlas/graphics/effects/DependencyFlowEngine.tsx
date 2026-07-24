import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { InstancedMesh } from "three";

interface DependencyFlowPath {
  id: string;
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  count: number;
}

const DEMO_FLOW_PATHS: DependencyFlowPath[] = [
  {
    id: "f1",
    from: [0, 0, 0],
    to: [-10.5, 0.5, 6],
    color: "#00f0ff",
    count: 8,
  },
  {
    id: "f2",
    from: [0, 0, 0],
    to: [14, 0.5, 0],
    color: "#a855f7",
    count: 8,
  },
  {
    id: "f3",
    from: [-10.5, 0.5, 6],
    to: [-2.2, -1, 3.5],
    color: "#38bdf8",
    count: 6,
  },
  {
    id: "f4",
    from: [14, 0.5, 0],
    to: [12.2, -1, -5.5],
    color: "#f59e0b",
    count: 6,
  },
];

export function DependencyFlowEngine() {
  const meshRef = useRef<InstancedMesh>(null);
  const tempObject = new THREE.Object3D();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.8;

    let index = 0;
    DEMO_FLOW_PATHS.forEach((path) => {
      const fromVec = new THREE.Vector3(...path.from);
      const toVec = new THREE.Vector3(...path.to);

      for (let i = 0; i < path.count; i++) {
        const progress = (t + i / path.count) % 1;
        const currentPos = new THREE.Vector3().lerpVectors(fromVec, toVec, progress);

        // Add subtle arc height curve
        currentPos.y += Math.sin(progress * Math.PI) * 1.2;

        tempObject.position.copy(currentPos);
        tempObject.scale.setScalar(0.12);
        tempObject.updateMatrix();

        meshRef.current.setMatrixAt(index++, tempObject.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const totalParticles = DEMO_FLOW_PATHS.reduce((sum, p) => sum + p.count, 0);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, totalParticles]}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.9} />
    </instancedMesh>
  );
}
