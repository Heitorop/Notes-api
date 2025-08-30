export class Router {
    constructor(controller) {
        this.controller = controller;
        this.routes = {
            "GET": {},
            "POST": {},
            "DELETE": {}
        };
    }

    get(path, handler, middlewares = []) {
        this.routes.GET[path] = { handler, middlewares };
    }

    post(path, handler, middlewares = []) {
        this.routes.POST[path] = { handler, middlewares };
    }

    delete(path, handler, middlewares = []) {
        this.routes.DELETE[path] = { handler, middlewares };
    }

    handle(req, res) {
        let body = "";
        req.on("data", chunk => body += chunk.toString());


        req.on("end", async () => {
            const methodRoutes = this.routes[req.method];
            const route = methodRoutes ? methodRoutes[req.url] : null;

            const middlewares = route.middlewares || [];
            let i = 0;
            console.log(req.url);
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