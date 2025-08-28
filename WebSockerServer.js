import { WebSocketServer, WebSocket } from "ws";


export class WSServer {
    wss = null;

   init(server){
    this.wss = new WebSocketServer({ server });
    this.wss.on('connection', (ws) => {
        console.log('New client connected');
        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });
        ws.send('Welcome new client!');
    });
   }

   broadcast(message) {
    if (!this.wss) return;
    this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
   }
}