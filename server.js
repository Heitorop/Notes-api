import http from "http";
import { NotesController } from "./controllers/NotesController.js";
import { Router } from "./router.js";
import { Middleware } from "./middleware.js";
import { WSServer } from "./WebSockerServer.js";
import { NotesService } from "./services/NotesService.js";

const PORT = process.env.PORT || 8000;

const wsServer = new WSServer();
const service = new NotesService();
const controller = new NotesController(service, wsServer);
const router = new Router(controller);
const middleware = new Middleware();

const selected = ['logger'];
const middlewaresToRun = selected.map(name => middleware[name].bind(middleware));

router.post("/api/notes/add", controller.add.bind(controller), middlewaresToRun);
router.post("/api/notes/mark-as-done", controller.markAsDone.bind(controller), middlewaresToRun);
router.get("/api/notes/notes", controller.getAll.bind(controller), middlewaresToRun);
router.delete("/api/notes/delete", controller.delete.bind(controller), middlewaresToRun);

const server = http.createServer((req, res) => router.handle(req, res));
wsServer.init(server);


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
