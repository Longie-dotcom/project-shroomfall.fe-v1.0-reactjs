import type { Role } from "../contracts/enums/identity/role";

export interface UserSession {
  name: string;
  role: Role;
}