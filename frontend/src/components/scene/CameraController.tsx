import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAtlasStore } from "../../store/atlasStore";

export function CameraController() {
  const { camera } = useThree();
  const controlsRef = useThree((state) => state.controls) as any;

  const targetCameraPosition = useAtlasStore((state) => state.targetCameraPosition);
  const targetLookAtPosition = useAtlasStore((state) => state.targetLookAtPosition);
  const clearCameraTargets = useAtlasStore((state) => state.clearCameraTargets);
  const stepBackPortal = useAtlasStore((state) => state.stepBackPortal);

  // Smooth lerp camera towards target portal during flight, then release controls
  useFrame((_, delta) => {
    if (targetCameraPosition) {
      const targetVec = new THREE.Vector3(...targetCameraPosition);
      camera.position.lerp(targetVec, Math.min(1, delta * 3.8));

      if (controlsRef && targetLookAtPosition) {
        const lookAtVec = new THREE.Vector3(...targetLookAtPosition);
        controlsRef.target.lerp(lookAtVec, Math.min(1, delta * 3.8));
        controlsRef.update();
      }

      // Once arrived close to destination, release camera flight so user can freely orbit & click
      if (camera.position.distanceTo(targetVec) < 0.1) {
        clearCameraTargets();
      }
    }
  });

  // ESC Key listener to step back 1 portal level
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Escape") {
        stepBackPortal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stepBackPortal]);

  return null;
}
