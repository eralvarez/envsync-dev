import BaseDto from "dtos/BaseDto";
import FirestoreService from "services/FirestoreService";

class ProjectDto extends BaseDto {
  id?: string | null;
  name: string | undefined;
  description?: string | null;
  organizationId?: string;

  constructor(data: ProjectDto) {
    super(data);

    if (data.id) {
      this.id = data.id;
    }
    this.name = data.name ?? undefined;
    this.description = data.description ?? null;
  }
}

class ProjectService extends FirestoreService<ProjectDto> {
  constructor() {
    super({ collectionName: "project", DocumentDto: ProjectDto });
  }
}

export default ProjectService;
export { ProjectDto };
