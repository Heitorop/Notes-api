import { WebSocketServer, WebSocket, RawData } from "ws";
import { Server } from "http";

export class WSServer {
    private wss: WebSocketServer | null = null;

    init(server: Server): void {
        this.wss = new WebSocketServer({ server });

        this.wss.on("connection", (ws: WebSocket) => {
            console.log("New client connected");

            ws.on("message", (message: RawData) => {
                console.log(`Received message: ${message.toString()}`);
            });

            ws.send("Welcome new client!");
        });
    }

    broadcast(message: string): void {
        if (!this.wss) return;

        this.wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}
