import { IncomingMessage, ServerResponse } from "http";

type Middleware = (req: IncomingMessage, res: ServerResponse, next: () => Promise<void>) => Promise<void>;
type Handler = (res: ServerResponse, body: any) => Promise<void>;

interface Route {
    handler: Handler;
    middlewares: Middleware[];
}

type Routes = {
    GET: Record<string, Route>;
    POST: Record<string, Route>;
    DELETE: Record<string, Route>;
};

export class Router {
    private controller: any;
    private routes: Routes;

    constructor(controller: any) {
        this.controller = controller;
        this.routes = {
            GET: {},
            POST: {},
            DELETE: {}
        };
    }

    get(path: string, handler: Handler, middlewares: Middleware[] = []) {
        this.routes.GET[path] = { handler, middlewares };
    }

    post(path: string, handler: Handler, middlewares: Middleware[] = []) {
        this.routes.POST[path] = { handler, middlewares };
    }

    delete(path: string, handler: Handler, middlewares: Middleware[] = []) {
        this.routes.DELETE[path] = { handler, middlewares };
    }

    handle(req: IncomingMessage, res: ServerResponse) {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            const methodRoutes = this.routes[req.method as keyof Routes];
            const route = methodRoutes ? methodRoutes[req.url || ""] : null;

            if (!route) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Not Found" }));
                return;
            }

            const middlewares = route.middlewares;
            let i = 0;

            const next = async () => {
                if (i < middlewares.length) {
                    await middlewares[i++](req, res, next);
                } else {
                    await route.handler(res, JSON.parse(body || "{}"));
                }
            };

            try {
                await next();
            } catch (err) {
                console.error(err);
                if (!res.headersSent) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                }
                res.end(JSON.stringify({ error: "Internal Server Error" }));
            }
        });
    }
}
