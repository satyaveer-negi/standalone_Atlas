export default function ReactorBase() {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.2, 0]}
        >
            <cylinderGeometry
                args={[2.5, 2.5, 0.1, 6]}
            />

            <meshStandardMaterial
                color="#0F172A"
                emissive="#00F5FF"
                emissiveIntensity={0.4}
            />
        </mesh>
    );
}