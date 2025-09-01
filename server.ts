import http, { IncomingMessage, ServerResponse } from "http";
import { NotesController } from "./controllers/NotesController.js";
import { Router } from "./router.js";
import { Middleware } from "./middleware.js";
import { WSServer } from "./WebSockerServer.js";
import { NotesService } from "./services/NotesService.js";
import { NotesRepository } from "./repositories/NotesRepository.js";

const PORT: number = Number(process.env.PORT) || 8000;

const repo = new NotesRepository();
const wsServer = new WSServer();
const service = new NotesService(repo);
const controller = new NotesController(service, wsServer);
const router = new Router(controller);
const middleware = new Middleware();

const selected: (keyof Middleware)[] = ["logger"];
const middlewaresToRun = selected.map(name => middleware[name].bind(middleware));

router.post("/api/notes/add", controller.add.bind(controller), middlewaresToRun);
router.post("/api/notes/mark-as-done", controller.markAsDone.bind(controller), middlewaresToRun);
router.get("/api/notes/notes", controller.getAll.bind(controller), middlewaresToRun);
router.delete("/api/notes/delete", controller.delete.bind(controller), middlewaresToRun);

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => router.handle(req, res));

wsServer.init(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
});
