import { MeshTransmissionMaterial } from "@react-three/drei";

import { AtlasTheme } from "../theme/atlasTheme";
import { getEmissiveIntensity } from "../utils/materialHelpers";

export interface AtlasMaterialProps {
    selected?: boolean;
    hovered?: boolean;

    color?: string;

    metalness?: number;
    roughness?: number;

    transmission?: number;
    thickness?: number;

    transparent?: boolean;
    opacity?: number;

    glass?: boolean;
}

export default function BaseMaterial({
    selected = false,
    hovered = false,

    color = AtlasTheme.colors.cyan,

    metalness = 1,
    roughness = 0,

    transmission = 1,
    thickness = 1,

    transparent = false,
    opacity = 1,

    glass = false,
}: AtlasMaterialProps) {
    const emissiveIntensity = getEmissiveIntensity(
        selected,
        hovered
    );

    if (glass) {
        return (
            <MeshTransmissionMaterial
                transmission={transmission}
                thickness={thickness}
                roughness={roughness}
                chromaticAberration={0.3}
                backside
            />
        );
    }

    return (
        <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            metalness={metalness}
            roughness={roughness}
            transparent={transparent}
            opacity={opacity}
        />
    );
}