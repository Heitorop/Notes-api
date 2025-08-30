import { NotesRepository } from "../repositories/NotesRepository.js";

export class NotesService {
    repo = new NotesRepository();

    async add(taskName) {
        if (!taskName) return false;

        try {
            await this.repo.add(taskName);
            return true;
        } catch (err) {
            console.error("DB insert error:", err);
            return false;
        }
    }

    async getAll() {
        return this.repo.getAll();
    }

    async markAsDone(taskName) {
        if (!taskName) return false;
        try {
            await this.repo.markAsDone(taskName);
            return true;
        } catch {
            return false;
        }
    }

    async delete(taskName) {
        if (!taskName) return false;
        try {
            await this.repo.delete(taskName);
            return true;
        } catch {
            return false;
        }
    }
}
