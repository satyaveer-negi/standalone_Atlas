import {
    EffectComposer,
    Bloom,
    Noise,
    Vignette,
    ChromaticAberration,
} from "@react-three/postprocessing";

import { BlendFunction } from "postprocessing";

export default function AtlasPostFX() {

    return (

        <EffectComposer multisampling={4}>

            <Bloom
                intensity={1.4}
                luminanceThreshold={0.15}
                luminanceSmoothing={0.8}
                mipmapBlur
            />

            <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={[0.0006, 0.0006]}
            />

            <Noise
                opacity={0.015}
            />

            <Vignette
                eskil={false}
                offset={0.15}
                darkness={0.8}
            />

        </EffectComposer>

    );

}