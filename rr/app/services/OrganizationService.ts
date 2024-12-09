import BaseDto from "dtos/BaseDto";
import { FirestoreService } from "services/FirestoreService";

class Organization extends BaseDto {
  id?: string;
  name: string;
  members?: string[];

  constructor(data: Organization) {
    super(data);

    this.id = data.id ?? undefined;
    this.name = data.name;
    this.members = data.members ?? [];
  }
}

class OrganizationService extends FirestoreService<Organization> {
  constructor() {
    super({ collectionName: "organizations", DocumentDto: Organization });
  }
}

export { OrganizationService, Organization };
