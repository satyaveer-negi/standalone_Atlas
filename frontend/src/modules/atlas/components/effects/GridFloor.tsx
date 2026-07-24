import { Grid } from "@react-three/drei";

export default function GridFloor() {
    return (
        <Grid
            position={[0, -2.5, 0]}
            infiniteGrid
            cellSize={1}
            cellThickness={0.6}
            sectionSize={8}
            sectionThickness={1.5}
            fadeDistance={120}
            fadeStrength={1}
            cellColor="#00F5FF"
            sectionColor="#4CC9F0"
        />
    );
}