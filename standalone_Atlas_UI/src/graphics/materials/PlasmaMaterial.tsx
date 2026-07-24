import BaseMaterial from "./BaseMaterial";
import type { AtlasMaterialProps } from "./BaseMaterial";
import { AtlasTheme } from "../theme/atlasTheme";

export default function PlasmaMaterial(
    props: AtlasMaterialProps
) {
    return (
        <BaseMaterial
            {...props}
            color={AtlasTheme.colors.plasma}
            metalness={
                AtlasTheme.material.metalness.plasma
            }
            roughness={
                AtlasTheme.material.roughness.plasma
            }
            transparent
            opacity={0.95}
        />
    );
}