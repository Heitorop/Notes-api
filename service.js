import url from 'url';
import path from 'path';
import { access, writeFile, readFile } from "fs/promises";
import { constants } from "fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB = path.join(__dirname, process.env.JSON_DB || "db.json");

export class TaskService {
    constructor() {}

    async fileExists() {
        try {
            await access(DB, constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }

    async readList() {
        try {
            const data = await readFile(DB, "utf-8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async writeList(list) {
        await writeFile(DB, JSON.stringify(list, null, 2));
    }

    isTaskExists(list, taskName) {
        return list.find(task => task.name === taskName);
    }


    async addTask(taskName) {
        if (await this.fileExists()) {
            if (!taskName) return false;

            const list = await this.readList();


            if (this.isTaskExists(list, taskName)) return false;

            list.push({ name: taskName, done: false, id: Date.now() });
            await this.writeList(list);
            return true;

        } else {
            if (!taskName) return false;
            const list = [{ name: taskName, done: false, id: Date.now() }];
            await writeFile(DB, JSON.stringify(list, null, 2));
            return true;
        }
    }

    async getTasks() {
        if (await this.fileExists()) {
            return await this.readList();
        } else {
            return [];
        }
    }

    async markAsDone(taskName) {
        if (await this.fileExists()) {
            if (!taskName) return false;

            const list = await this.readList();

            if (!this.isTaskExists(list, taskName)) return false;

            list.forEach(task => {
                if (task.name === taskName) {
                    task.done = true;
                }
            });

            await this.writeList(list);
            return true;

        } else {
            return false;
        }
    }

    async deleteTask(taskName) {
        if (await this.fileExists()) {
            if (!taskName) return false;

            const list = await this.readList();

            if (!this.isTaskExists(list, taskName)) return false;

            const newList = list.filter(task => task.name !== taskName);
            await this.writeList(newList);
            return true;

        } else {
            return false;
        }
    }
}
