import { Sphere } from "@react-three/drei";

interface Props {

    position: [number, number, number];

    color?: string;

}

export default function DataPacket({

    position,

    color = "#00F5FF"

}: Props) {

    return (

        <Sphere

            args={[0.04, 12, 12]}

            position={position}

        >

            <meshStandardMaterial

                color={color}

                emissive={color}

                emissiveIntensity={10}

            />

        </Sphere>

    );

}