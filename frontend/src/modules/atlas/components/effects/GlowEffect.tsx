import { Bloom } from "@react-three/postprocessing";

export default function GlowEffect() {
    return (
        <Bloom
            intensity={2}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
        />
    );
}