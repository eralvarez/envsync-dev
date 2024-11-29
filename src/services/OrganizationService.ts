import BaseDto from "dtos/BaseDto";
import FirestoreService from "services/FirestoreService";

class OrganizationDto extends BaseDto {
  id?: string;
  name: string;
  members?: string[];

  constructor(data: OrganizationDto) {
    super(data);

    this.id = data.id ?? undefined;
    this.name = data.name;
    this.members = data.members ?? [];
  }
}

class OrganizationService extends FirestoreService<OrganizationDto> {
  constructor() {
    super({ collectionName: "organization", DocumentDto: OrganizationDto });
  }
}

export default OrganizationService;
export { OrganizationDto };
