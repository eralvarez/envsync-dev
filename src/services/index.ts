// global services

import { AuthService } from "./AuthService";
import { OrganizationService } from "./OrganizationService";

const authService = new AuthService();
const organizationService = new OrganizationService();

export { authService, organizationService };
