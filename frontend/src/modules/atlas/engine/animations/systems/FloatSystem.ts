import * as THREE from "three";

import type { AnimationDescriptor } from "../types/animation";

export default function FloatSystem(

    object: THREE.Object3D,

    animation: AnimationDescriptor,

    elapsed: number

) {

    const intensity = animation.intensity ?? .2;

    const speed = animation.speed ?? 2;

    object.position.y +=

        Math.sin(elapsed * speed) *

        intensity *

        0.01;

}