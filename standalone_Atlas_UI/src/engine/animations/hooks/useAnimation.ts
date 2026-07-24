import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { AnimationRegistry } from "../registry/AnimationRegistry";
import type { AnimationDescriptor } from "../types/animation";

import * as THREE from "three";

export function useAnimation(

    animations: AnimationDescriptor[]

) {

    const ref = useRef<THREE.Group>(null!);

    useFrame((state, delta) => {

        if (!ref.current) return;

        animations.forEach(animation => {

            const system =

                AnimationRegistry[animation.type];

            system(

                ref.current,

                animation,

                delta,

                state.clock.elapsedTime

            );

        });

    });

    return ref;

}