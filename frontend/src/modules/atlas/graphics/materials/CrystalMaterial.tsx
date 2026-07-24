import BaseMaterial from "./BaseMaterial";
import type { AtlasMaterialProps } from "./BaseMaterial";
import { AtlasTheme } from "../theme/atlasTheme";

export default function CrystalMaterial(
    props: AtlasMaterialProps
) {

    return (

        <BaseMaterial

            {...props}

            color={
                AtlasTheme.colors.crystal
            }

            metalness={
                AtlasTheme.material.metalness.crystal
            }

            roughness={
                AtlasTheme.material.roughness.crystal
            }

        />

    );

}