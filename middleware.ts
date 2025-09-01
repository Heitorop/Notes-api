import { IncomingMessage, ServerResponse } from "http";

export class Middleware {
    async logger(req: IncomingMessage, res: ServerResponse, next: () => Promise<void>): Promise<void> {
        console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
        await next();
    }
}