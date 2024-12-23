import { get } from "lodash";

import BaseDto from "dtos/BaseDto";
import { FirestoreService } from "services/FirestoreService";
import { Field } from "decorators/firestore";

// DTO
class Organization extends BaseDto {
  id?: string;
  name?: string;
  members?: string[] = [];

  constructor(data: Organization) {
    super(data);

    Object.keys(data).forEach((dataKey: string) => {
      (this as any)[dataKey] = get(data, dataKey);
    });
  }
}

class OrganizationService extends FirestoreService<Organization> implements Organization {
  @Field({
    label: "Name",
    required: true,
  })
  name?: string;

  constructor() {
    super({ collectionName: "organizations", DocumentDto: Organization });
  }
}

export { OrganizationService, Organization };
