import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:8000");

ws.on("open", () => {
    console.log("Connected to server");

    // отправляем тестовое сообщение
    ws.send(JSON.stringify({ action: "test" }));
});

ws.on("message", (data) => {
    console.log("Received:", data.toString());
});

ws.on("close", () => {
    console.log("Connection closed");
});

ws.on("error", (err) => {
    console.error("Error:", err);
});
