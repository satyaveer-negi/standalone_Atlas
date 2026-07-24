import { Sparkles } from "@react-three/drei";

export default function FloatingParticles() {
    return (
        <Sparkles
            count={250}
            size={3}
            scale={[30, 15, 30]}
            speed={0.25}
            opacity={1}
            color="#4CC9F0"
        />
    );
}