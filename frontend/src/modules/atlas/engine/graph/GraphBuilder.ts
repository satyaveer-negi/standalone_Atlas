import type { AtlasGraph, AtlasNode, AtlasEdge } from "../../types/graph";

interface ManagedFile {
    id: number;
    file: string;
    filename: string;
    version?: number;
    is_latest?: boolean;
}

export default class GraphBuilder {
    static fromTasksGroup(
        sprintName: string,
        tasksGroup: Record<string, Record<string, ManagedFile[]>>
    ): AtlasGraph {
        const nodes: AtlasNode[] = [];
        const edges: AtlasEdge[] = [];

        // ----------------------------
        // Project Node
        // ----------------------------

        const projectId = "project";

        nodes.push({
            id: projectId,
            type: "project",
            name: sprintName,
            position: [0, 0, 0],
            data: {
                sprintName,
            },
        });

        // ----------------------------
        // Sprint Node
        // ----------------------------

        const sprintId = `sprint-${sprintName}`;

        nodes.push({
            id: sprintId,
            type: "sprint",
            name: sprintName,
            position: [0, 0, 0],
            parent: projectId,
        });

        edges.push({
            id: `${projectId}-${sprintId}`,
            source: projectId,
            target: sprintId,
        });

        // ----------------------------
        // Tasks
        // ----------------------------

        Object.entries(tasksGroup).forEach(([taskName, files]) => {
            const taskId = `task-${taskName}`;

            nodes.push({
                id: taskId,
                type: "task",
                name: taskName,
                position: [0, 0, 0],
                parent: sprintId,
            });

            edges.push({
                id: `${sprintId}-${taskId}`,
                source: sprintId,
                target: taskId,
            });

            // ----------------------------
            // Files
            // ----------------------------

            Object.entries(files).forEach(([filename, versions]) => {
                const fileId = `${taskId}/file/${filename}`;

                nodes.push({
                    id: fileId,
                    type: "file",
                    name: filename,
                    position: [0, 0, 0],
                    parent: taskId,
                    data: {
                        versions: versions.length,
                        filename,
                    },
                });

                edges.push({
                    id: `${taskId}-${fileId}`,
                    source: taskId,
                    target: fileId,
                });

                // ----------------------------
                // Versions
                // ----------------------------

                versions.forEach((version, index) => {
                    const versionId = `${fileId}/version/${version.version ?? index + 1}`;

                    nodes.push({
                        id: versionId,
                        type: "version",
                        name: `v${version.version ?? index + 1}`,
                        position: [0, 0, 0],
                        parent: fileId,
                        data: version,
                    });

                    edges.push({
                        id: `${fileId}-${versionId}`,
                        source: fileId,
                        target: versionId,
                    });
                });
            });
        });

        return {
            nodes,
            edges,
        };
    }
}