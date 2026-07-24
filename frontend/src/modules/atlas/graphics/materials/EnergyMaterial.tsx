import BaseMaterial from "./BaseMaterial";
import type { AtlasMaterialProps } from "./BaseMaterial";
import { AtlasTheme } from "../theme/atlasTheme";

export default function EnergyMaterial(
    props: AtlasMaterialProps
) {
    return (
        <BaseMaterial
            {...props}
            color={AtlasTheme.colors.energy}
            metalness={
                AtlasTheme.material.metalness.energy
            }
            roughness={
                AtlasTheme.material.roughness.energy
            }
        />
    );
}