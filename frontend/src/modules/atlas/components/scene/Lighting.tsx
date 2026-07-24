import { Environment } from "@react-three/drei";

export default function Lighting() {
  return (
    <>
      {/* Deep Space Ambient Light */}
      <ambientLight intensity={0.4} color="#0f172a" />

      {/* Main Directional Sun / Key Light */}
      <directionalLight
        position={[12, 18, 10]}
        intensity={2.2}
        color="#f8fafc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Cyan Core Holographic Point Light */}
      <pointLight
        position={[0, 2, 0]}
        intensity={25}
        distance={25}
        color="#00f0ff"
        decay={2}
      />

      {/* Cyber Violet Rim Light */}
      <pointLight
        position={[-10, 8, -10]}
        intensity={15}
        distance={30}
        color="#a855f7"
        decay={2}
      />

      {/* Emerald Accent Light */}
      <pointLight
        position={[10, -5, 10]}
        intensity={10}
        distance={20}
        color="#10b981"
        decay={2}
      />

      {/* HDR Environment Reflections */}
      <Environment preset="night" />
    </>
  );
}