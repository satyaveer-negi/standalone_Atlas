import BaseMaterial from "./BaseMaterial";
import type { AtlasMaterialProps } from "./BaseMaterial";
import { AtlasTheme } from "../theme/atlasTheme";

export default function GlassMaterial(
    props: AtlasMaterialProps
) {
    return (
        <BaseMaterial
            {...props}
            glass
            color={AtlasTheme.colors.glass}
            metalness={
                AtlasTheme.material.metalness.glass
            }
            roughness={
                AtlasTheme.material.roughness.glass
            }
            transmission={
                AtlasTheme.material.transmission.glass
            }
            thickness={1.6}
        />
    );
}