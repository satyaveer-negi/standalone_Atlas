import * as THREE from "three";

import type { AnimationDescriptor } from "../types/animation";

export default function RotationSystem(

    object: THREE.Object3D,

    animation: AnimationDescriptor,

    delta: number

) {

    const axis = animation.axis ?? "y";

    const speed = animation.speed ?? 0.25;

    object.rotation[axis] += delta * speed;

}