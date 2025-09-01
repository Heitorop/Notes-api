import { db } from "../db/index.js";
import { notes } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { Note, NewNote } from "../types.js";

export class NotesRepository {
    async add(taskName: string): Promise<Note[]> {
        const newNote: NewNote = {
            name: taskName,
            is_done: false,
            created_at: new Date(),
        };

        return db.insert(notes).values(newNote).returning();
    }

    async getAll(): Promise<Note[]> {
        return db.select().from(notes);
    }

    async markAsDone(taskName: string): Promise<Note[]> {
        return db.update(notes).set({ is_done: true }).where(eq(notes.name, taskName)).returning();
    }

    async delete(taskName: string): Promise<Note[]> {
        return db.delete(notes).where(eq(notes.name, taskName)).returning();;
    }
}
