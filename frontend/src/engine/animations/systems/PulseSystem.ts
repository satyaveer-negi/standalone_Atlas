import * as THREE from "three";

import type { AnimationDescriptor } from "../types/animation";

export default function PulseSystem(

    object: THREE.Object3D,

    animation: AnimationDescriptor,

    elapsed: number

) {

    const speed = animation.speed ?? 2;

    const pulse =

        1 +

        Math.sin(elapsed * speed) *

        0.05;

    object.scale.setScalar(pulse);

}