import ReactorBase from "./ReactorBase";
import ReactorCore from "./ReactorCore";
import EnergyRing from "./EnergyRing";
import PlasmaColumn from "./PlasmaColumn";

export default function AtlasReactor() {
    return (
        <group>

            <ReactorBase />

            <ReactorCore />

            <EnergyRing
                radius={1.3}
                speed={0.4}
                axis="y"
            />

            <EnergyRing
                radius={1.6}
                speed={0.8}
                axis="x"
                color="#7B2FF7"
            />

            <EnergyRing
                radius={1.9}
                speed={0.6}
                axis="z"
            />

            <PlasmaColumn />

        </group>
    );
}