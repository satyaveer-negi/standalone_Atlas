import { Stars } from "@react-three/drei";

export default function StarField() {
    return (
        <Stars
            radius={250}
            depth={80}
            count={6000}
            factor={6}
            saturation={0}
            fade
            speed={0.4}
        />
    );
}