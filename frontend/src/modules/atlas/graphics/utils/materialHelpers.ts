import { AtlasTheme } from "../theme/atlasTheme";

export function getEmissiveIntensity(
    selected?: boolean,
    hovered?: boolean
) {

    if (selected)
        return AtlasTheme.material.emissive.selected;

    if (hovered)
        return AtlasTheme.material.emissive.hover;

    return AtlasTheme.material.emissive.idle;

}

export function getScale(
    selected?: boolean,
    hovered?: boolean
) {

    if (selected)
        return AtlasTheme.animation.selectedScale;

    if (hovered)
        return AtlasTheme.animation.hoverScale;

    return 1;

}