import ProjectCoreEntity from "../../components/entities/ProjectCoreEntity";
import SprintEntity from "../../components/entities/SprintEntity";
import TaskEntity from "../../components/entities/TaskEntity";
import FileEntity from "../../components/entities/FileEntity";
import VersionEntity from "../../components/entities/VersionEntity";

export const EntityRegistry = {

    project: ProjectCoreEntity,

    sprint: SprintEntity,

    task: TaskEntity,

    file: FileEntity,

    version: VersionEntity,

} as const;