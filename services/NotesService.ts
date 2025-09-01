import { NotesRepository } from "../repositories/NotesRepository.js";
import { Note } from "../types.js";

export class NotesService {
    constructor(private readonly repo: NotesRepository) { }

    async add(taskName: string): Promise<boolean> {
        if (!taskName) return false;

        try {
            await this.repo.add(taskName);
            return true;
        } catch (err) {
            console.error("DB insert error:", err);
            return false;
        }
    }

    async getAll(): Promise<Note[]> {
        return this.repo.getAll();
    }

    async markAsDone(taskName: string): Promise<boolean> {
        if (!taskName) return false;
        try {
            await this.repo.markAsDone(taskName);
            return true;
        } catch {
            return false;
        }
    }

    async delete(taskName: string): Promise<boolean> {
        if (!taskName) return false;
        try {
            await this.repo.delete(taskName);
            return true;
        } catch {
            return false;
        }
    }
}
