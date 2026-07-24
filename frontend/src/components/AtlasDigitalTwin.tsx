import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import { useMemo } from "react";

interface ManagedFile {
    id: number;
    file: string;
    filename: string;
    version?: number;
    is_latest?: boolean;
}

interface Props {
    sprintName: string;
    tasksGroup: Record<string, Record<string, ManagedFile[]>>;
}

interface Node {
    id: string;
    type: "task" | "file";
    name: string;
    position: [number, number, number];
}

export function AtlasDigitalTwin({
    sprintName,
    tasksGroup,
}: Props) {

    const nodes = useMemo(() => {

        const list: Node[] = [];

        const tasks = Object.keys(tasksGroup);

        tasks.forEach((task, taskIndex) => {

            const angle =
                (taskIndex / Math.max(tasks.length, 1)) *
                Math.PI *
                2;

            const taskRadius = 6;

            const taskPosition: [number, number, number] = [

                Math.cos(angle) * taskRadius,

                0,

                Math.sin(angle) * taskRadius,

            ];

            list.push({

                id: task,

                type: "task",

                name: task,

                position: taskPosition,

            });

            const files = Object.keys(tasksGroup[task]);

            files.forEach((file, fileIndex) => {

                const fileAngle =
                    angle +
                    ((fileIndex + 1) * 0.45);

                const fileRadius = 2;

                list.push({

                    id: task + file,

                    type: "file",

                    name: file,

                    position: [

                        taskPosition[0] +
                        Math.cos(fileAngle) *
                        fileRadius,

                        0,

                        taskPosition[2] +
                        Math.sin(fileAngle) *
                        fileRadius,

                    ],

                });

            });

        });

        return list;

    }, [tasksGroup]);

    return (

        <div className="w-full h-[700px] rounded-3xl overflow-hidden">

            <Canvas camera={{ position: [0, 10, 18] }}>

                <color attach="background" args={["#020617"]} />

                <ambientLight intensity={0.5} />

                <pointLight
                    position={[0, 5, 0]}
                    intensity={25}
                    color="#00F5FF"
                />

                <OrbitControls
                    autoRotate
                    autoRotateSpeed={0.5}
                />

                {/* Sprint */}

                <mesh>

                    <sphereGeometry args={[1, 64, 64]} />

                    <meshStandardMaterial
                        emissive="#00F5FF"
                        emissiveIntensity={4}
                        color="#111827"
                    />

                </mesh>

                <Text

                    position={[0, 1.8, 0]}

                    color="white"

                    fontSize={0.35}

                >

                    {sprintName}

                </Text>

                {nodes.map((node) => (

                    <group
                        key={node.id}
                        position={node.position}
                    >

                        <mesh>

                            <sphereGeometry
                                args={[
                                    node.type === "task"
                                        ? 0.45
                                        : 0.2,
                                    32,
                                    32,
                                ]}
                            />

                            <meshStandardMaterial
                                emissive={
                                    node.type === "task"
                                        ? "#7B2FF7"
                                        : "#00F5FF"
                                }
                                emissiveIntensity={3}
                                color="#111827"
                            />

                        </mesh>

                        <Text
                            position={[0, 0.55, 0]}
                            fontSize={0.16}
                            color="white"
                        >
                            {node.name}
                        </Text>

                        <Line
                            points={[
                                [0, 0, 0],
                                [
                                    -node.position[0],
                                    0,
                                    -node.position[2],
                                ],
                            ]}
                            color="#00F5FF"
                        />

                    </group>

                ))}

            </Canvas>

        </div>

    );

}