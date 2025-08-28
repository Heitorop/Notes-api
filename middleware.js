export class Middleware {

    async logger(req, res, next) {
        console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
        await next();
    }
}