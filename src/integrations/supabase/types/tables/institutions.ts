import type { Database } from "../database";

export type InstitutionsTable = Database["public"]["Tables"]["institutions"];
export type Institution = InstitutionsTable["Row"];
export type InsertInstitution = InstitutionsTable["Insert"];
export type UpdateInstitution = InstitutionsTable["Update"];