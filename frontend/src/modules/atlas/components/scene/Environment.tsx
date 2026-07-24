import { Fog } from "three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function Environment() {
    const { scene } = useThree();

    useEffect(() => {
        scene.fog = new Fog("#020617", 18, 65);
    }, [scene]);

    return null;
}