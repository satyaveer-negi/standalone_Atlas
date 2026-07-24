import BaseMaterial from "./BaseMaterial";
import type { AtlasMaterialProps } from "./BaseMaterial";
import { AtlasTheme } from "../theme/atlasTheme";

export default function HolographicMaterial(
    props: AtlasMaterialProps
) {
    return (
        <BaseMaterial
            {...props}
            color={AtlasTheme.colors.hologram}
            metalness={
                AtlasTheme.material.metalness.hologram
            }
            roughness={
                AtlasTheme.material.roughness.hologram
            }
            transparent
            opacity={0.65}
        />
    );
}