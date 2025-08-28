import http from "http";
import { TaskController } from "./controller.js";
import { Router } from "./router.js";
import { Middleware } from "./middleware.js";
import { WSServer } from "./WebSockerServer.js";
import { TaskService } from "./service.js";

const PORT = process.env.PORT || 8000;

const wsServer = new WSServer();
const service = new TaskService();
const controller = new TaskController(service, wsServer);
const router = new Router(controller);
const middleware = new Middleware();

const selected = ['logger'];
const middlewaresToRun = selected.map(name => middleware[name].bind(middleware));

router.post("/api/add-task", controller.addTask.bind(controller));
router.post("/api/mark-as-done", controller.markAsDone.bind(controller));
router.get("/api/tasks", controller.getTasks.bind(controller), middlewaresToRun);
router.delete("/api/delete-task", controller.deleteTask.bind(controller));

const server = http.createServer((req, res) => router.handle(req, res));
wsServer.init(server);


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
