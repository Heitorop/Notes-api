export class TaskController {
    constructor(service, wsServer) {
        this.service = service;
        this.wsServer = wsServer;
    }

    async addTask(res, task) {
        console.log(task);
        const result = await this.service.addTask(task.name);
        if (result) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, task: task.name }));
            console.log(`Task added: ${task.name}`);
        } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Failed to add task" }));
            console.log(`Something went wrong while adding task: ${task.name}`);
        }
    }

    async getTasks(res) {
        const tasks = await this.service.getTasks() || [];
        if (!tasks.length) {
            console.log("No tasks found");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "No tasks found" }));
            this.wsServer.broadcast(JSON.stringify({ type: "update", tasks: [] }));
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, tasks: tasks }));
            this.wsServer.broadcast(JSON.stringify({ type: "update", tasks: tasks }));
        }
    }

    async markAsDone(res, task) {
        const result = await this.service.markAsDone(task.name);
        if (result) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, task: task.name }));
            console.log(`Task is done: ${task.name}`);
        } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Failed to mark task as done" }));
            console.log(`Something went wrong while marking task as done: ${task.name}`);
        }
    }

    async deleteTask(res, task) {
        const result = await this.service.deleteTask(task.name);
        if (result) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, task: task.name }));
            console.log(`Task deleted: ${task.name}`);
        } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, message: "Failed to delete task" }));
            console.log(`Something went wrong while deleting task: ${task.name}`);
        }
    }
}