import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
    OrbitControls,
    PerspectiveCamera,
    Stats,
    Loader,
} from "@react-three/drei";

import AtlasScene from "./AtlasScene";
import { useAtlasStore } from "../../store/atlasStore";

import * as THREE from "three";

function KeyboardController() {
    const { camera } = useThree();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            const key = e.key.toLowerCase();
            if (key === "i") {
                // Zoom IN
                if (camera.position.length() > 2.5) {
                    camera.position.multiplyScalar(0.88);
                }
            } else if (key === "o") {
                // Zoom OUT
                if (camera.position.length() < 38) {
                    camera.position.multiplyScalar(1.12);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [camera]);

    return null;
}

export default function AtlasCanvas() {
    const autoRotate = useAtlasStore((state) => state.autoRotate);

    // Suppress internal Three.js Clock deprecation warning triggered by Fiber/Drei loop
    useEffect(() => {
        const originalWarn = console.warn;
        console.warn = (...args: any[]) => {
            if (typeof args[0] === "string" && (args[0].includes("THREE.Clock") || args[0].includes("PCFSoftShadowMap"))) {
                return;
            }
            originalWarn.apply(console, args);
        };
        return () => {
            console.warn = originalWarn;
        };
    }, []);

    return (
        <>
            <Canvas
                shadows={{ type: THREE.PCFShadowMap }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
            >
                {/* Background */}
                <color attach="background" args={["#020617"]} />

                {/* Camera */}
                <PerspectiveCamera
                    makeDefault
                    position={[0, 6, 14]}
                    fov={45}
                />

                <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.08}
                    autoRotate={autoRotate}
                    autoRotateSpeed={0.4}
                    minDistance={2}
                    maxDistance={40}
                    maxPolarAngle={Math.PI / 2}
                />

                <KeyboardController />

                <Suspense fallback={null}>
                    <AtlasScene />
                </Suspense>

                <Stats />
            </Canvas>

            <Loader />
        </>
    );
}