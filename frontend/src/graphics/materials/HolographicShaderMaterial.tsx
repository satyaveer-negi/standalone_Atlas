import { shaderMaterial } from "@react-three/drei";

import * as THREE from "three";

import vertex from "../shaders/hologram/hologram.vert";
import fragment from "../shaders/hologram/hologram.frag";

export const HolographicShaderMaterial = shaderMaterial(

    {

        uTime: 0,

        uColor: new THREE.Color("#00F5FF"),

    },

    vertex,

    fragment

);