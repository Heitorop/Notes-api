// const getRequestBody = (req) => {
//     return new Promise((resolve, reject) => {
//         let body = "";
//         req.on("data", chunk => body += chunk.toString());
//         req.on("end", () => {
//             try {
//                 resolve(JSON.parse(body));
//             } catch (err) {
//                 reject(err);
//             }
//         });
//     });
// };



// export const router = async (req, res) => {
//     if (req.method === 'POST' && req.url === '/api/add-task') {
//         try {
//             const data = await getRequestBody(req);
//             await controller.addTask(res, data.name);
//         } catch (err) {
//             console.error(err);
//             res.writeHead(400, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ error: "Invalid JSON" }));
//         }
//     } else if (req.method === 'POST' && req.url === '/api/mark-as-done') {
//         try {
//             const data = await getRequestBody(req);
//             await controller.markAsDone(res, data.name);
//         } catch (err) {
//             console.error(err);
//             res.writeHead(400, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ error: "Invalid JSON" }));
//         }
//     } else if (req.method === 'GET' && req.url === '/api/tasks') {
//         await controller.getTasks(res);
//     } else if (req.method === 'DELETE' && req.url === '/api/delete-task') {
//         try {
//             const data = await getRequestBody(req);
//             await controller.deleteTask(res, data.name);
//         } catch (err) {
//             console.error(err);
//             res.writeHead(400, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ error: "Invalid JSON" }));
//         }
//     } else {
//         res.writeHead(404, { "Content-Type": "text/plain" });
//         res.end("Not Found");
//     }

// }

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

    handle(req,res){
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