import { ServerResponse } from "http";
import { NotesService } from "../services/NotesService";
import { Note, TaskPayload } from "../types";
import { WSServer } from "../WebSockerServer";


export class NotesController {
    constructor(
        private readonly service: NotesService,
        private readonly wsServer: WSServer
    ) { }

    private sendJson(res: ServerResponse, status: number, body: unknown): void {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(body));
    }


    async add(res: ServerResponse, task: TaskPayload): Promise<void> {
        const result = await this.service.add(task.name);

        if (result) {
            this.sendJson(res, 200, { success: true, task: task.name });
        } else {
            this.sendJson(res, 400, { success: false, message: "Failed to add task" });
        }
    }

    async getAll(res: ServerResponse): Promise<void> {
        const tasks: Note[] = await this.service.getAll();

        if (!tasks.length) {
            this.sendJson(res, 200, { error: "No tasks found" });
            this.wsServer.broadcast(JSON.stringify({ type: "update", tasks: [] }));
        } else {
            this.sendJson(res, 200, { success: true, tasks });
            this.wsServer.broadcast(JSON.stringify({ type: "update", tasks }));
        }
    }

    async markAsDone(res: ServerResponse, task: TaskPayload): Promise<void> {
        const result = await this.service.markAsDone(task.name);

        if (result) {
            this.sendJson(res, 200, { success: true, task: task.name });
        } else {
            this.sendJson(res, 400, { success: false, message: "Failed to mark task as done" });
        }
    }

    async delete(res: ServerResponse, task: TaskPayload): Promise<void> {
        const result = await this.service.delete(task.name);

        if (result) {
            this.sendJson(res, 200, { success: true, task: task.name });
        } else {
            this.sendJson(res, 400, { success: false, message: "Failed to delete task" });
        }
    }
}

