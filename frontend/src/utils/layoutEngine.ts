import type { AtlasNode, AtlasEdge } from "../types/atlas";

interface ManagedFile {
    id: number;
    file: string;
    filename: string;
    version?: number;
}

export function buildAtlasGraph(
    sprintName: string,
    tasksGroup: Record<string, Record<string, ManagedFile[]>>
) {

    const nodes: AtlasNode[] = [];

    const edges: AtlasEdge[] = [];

    nodes.push({

        id: "project",

        type: "project",

        name: sprintName,

        position: [0, 0, 0]

    });

    const tasks = Object.keys(tasksGroup);

    tasks.forEach((task, taskIndex) => {

        const angle = (taskIndex / tasks.length) * Math.PI * 2;

        const taskPos: [number, number, number] = [

            Math.cos(angle) * 7,

            0,

            Math.sin(angle) * 7

        ];

        nodes.push({

            id: task,

            parent: "project",

            type: "task",

            name: task,

            position: taskPos

        });

        edges.push({

            id: "edge-" + task,

            source: "project",

            target: task

        });

        const files = Object.keys(tasksGroup[task]);

        files.forEach((file, fileIndex) => {

            const a = angle + fileIndex * 0.55;

            const filePos: [number, number, number] = [

                taskPos[0] + Math.cos(a) * 2,

                0,

                taskPos[2] + Math.sin(a) * 2

            ];

            nodes.push({

                id: task + "-" + file,

                parent: task,

                type: "file",

                name: file,

                position: filePos

            });

            edges.push({

                id: "edge-" + task + "-" + file,

                source: task,

                target: task + "-" + file

            });

        });

    });

    return {

        nodes,

        edges

    };

}