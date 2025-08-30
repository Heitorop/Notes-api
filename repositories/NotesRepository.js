import { db } from "../db/index.ts";
import { notes } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export class NotesRepository {
    async add(taskName) {
        return db.insert(notes).values({
            name: taskName,
            is_done: false,
            created_at: new Date(),
        });
    }

    async getAll() {
        return db.select().from(notes);
    }

    async markAsDone(taskName) {
        return db.update(notes).set({ is_done: true }).where(eq(notes.name, taskName));
    }

    async delete(taskName) {
        return db.delete(notes).where(eq(notes.name, taskName));
    }
}
