import React from "react";

import type { AtlasNode } from "../../types/graph";

import ProjectCoreEntity from "../../components/entities/ProjectCoreEntity";
import SprintEntity from "../../components/entities/SprintEntity";
import TaskEntity from "../../components/entities/TaskEntity";
import FileEntity from "../../components/entities/FileEntity";
import VersionEntity from "../../components/entities/VersionEntity";
import type { EntityProps } from "../../types/entity";


export interface EntityFactoryProps {
    node: AtlasNode;
    selected?: boolean;
    hovered?: boolean;
}

export default function EntityFactory({
    node,
    selected = false,
    hovered = false,
}: EntityFactoryProps) {
    switch (node.type) {

        case "project":
            return <ProjectCoreEntity
                node={node}
                selected={selected}
                hovered={hovered}
            />;

        case "sprint":
            return <SprintEntity
                node={node}
                selected={selected}
                hovered={hovered}
            />;

        case "task":
            return <TaskEntity
                node={node}
                selected={selected}
                hovered={hovered}
            />;

        case "file":
            return <FileEntity
                node={node}
                selected={selected}
                hovered={hovered}
            />;

        case "version":
            return <VersionEntity
                node={node}
                selected={selected}
                hovered={hovered}
            />;
    }
}