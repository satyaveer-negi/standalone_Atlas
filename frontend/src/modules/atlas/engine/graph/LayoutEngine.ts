import type { AtlasGraph, AtlasNode } from "../../types/graph";

export default class LayoutEngine {

    static radial(graph: AtlasGraph): AtlasGraph {

        const project =
            graph.nodes.find(n => n.type === "project");

        if (!project) return graph;

        project.position = [0, 0, 0];

        //--------------------------------------------------
        // Sprint Layer
        //--------------------------------------------------

        const sprints = graph.nodes.filter(
            n => n.type === "sprint"
        );

        sprints.forEach((sprint, sprintIndex) => {

            const sprintAngle =
                (Math.PI * 2 * sprintIndex) /
                Math.max(1, sprints.length);

            sprint.position = [

                Math.cos(sprintAngle) * 4,

                0,

                Math.sin(sprintAngle) * 4,

            ];

            this.layoutTasks(graph, sprint);

        });

        return graph;

    }

    //--------------------------------------------------
    // Task Layer
    //--------------------------------------------------

    private static layoutTasks(
        graph: AtlasGraph,
        sprint: AtlasNode
    ) {

        const tasks = graph.nodes.filter(

            n =>

                n.parent === sprint.id &&

                n.type === "task"

        );

        const radius = 6;

        tasks.forEach((task, index) => {

            const angle =
                (Math.PI * 2 * index) /
                Math.max(1, tasks.length);

            task.position = [

                sprint.position[0] +
                Math.cos(angle) * radius,

                0,

                sprint.position[2] +
                Math.sin(angle) * radius,

            ];

            this.layoutFiles(graph, task, angle);

        });

    }

    //--------------------------------------------------
    // File Layer
    //--------------------------------------------------

    private static layoutFiles(
        graph: AtlasGraph,
        task: AtlasNode,
        baseAngle: number
    ) {

        const files = graph.nodes.filter(

            n =>

                n.parent === task.id &&

                n.type === "file"

        );

        const radius = 2;

        files.forEach((file, index) => {

            const angle =
                baseAngle +
                (Math.PI * 2 * index) /
                Math.max(1, files.length);

            file.position = [

                task.position[0] +
                Math.cos(angle) * radius,

                0.35,

                task.position[2] +
                Math.sin(angle) * radius,

            ];

            this.layoutVersions(graph, file, angle);

        });

    }

    //--------------------------------------------------
    // Version Layer
    //--------------------------------------------------

    private static layoutVersions(
        graph: AtlasGraph,
        file: AtlasNode,
        baseAngle: number
    ) {

        const versions = graph.nodes.filter(

            n =>

                n.parent === file.id &&

                n.type === "version"

        );

        const radius = 0.7;

        versions.forEach((version, index) => {

            const angle =
                baseAngle +
                (Math.PI * 2 * index) /
                Math.max(1, versions.length);

            version.position = [

                file.position[0] +
                Math.cos(angle) * radius,

                0.6,

                file.position[2] +
                Math.sin(angle) * radius,

            ];

        });

    }

}