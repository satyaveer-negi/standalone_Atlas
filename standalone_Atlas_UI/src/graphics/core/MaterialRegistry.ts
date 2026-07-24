import GlassMaterial from "../materials/GlassMaterial";
import EnergyMaterial from "../materials/EnergyMaterial";
import CrystalMaterial from "../materials/CrystalMaterial";
import PlasmaMaterial from "../materials/PlasmaMaterial";
import HolographicMaterial from "../materials/HolographicMaterial";

export const MaterialRegistry = {

    glass: GlassMaterial,

    energy: EnergyMaterial,

    crystal: CrystalMaterial,

    plasma: PlasmaMaterial,

    hologram: HolographicMaterial,

} as const;