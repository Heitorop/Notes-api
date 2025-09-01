import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { notes } from "./db/schema";

export type Note = InferSelectModel<typeof notes>;
export type NewNote = InferInsertModel<typeof notes>;

export interface TaskPayload {
    name: string;
}