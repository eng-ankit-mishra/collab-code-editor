require("dotenv").config();

const WebSocket = require("ws");
const http = require("http");
const jwt = require("jsonwebtoken");
const { setupWSConnection } = require("y-websocket/bin/utils");


const JWT_SECRET = process.env.JWT_SECRET;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Yjs WebSocket Sync Server is running!");
});

const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {

    const url = new URL(request.url, `ws://${request.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
    }

    try {
        const secretKey = Buffer.from(JWT_SECRET, 'base64');
        jwt.verify(token, secretKey);

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });

    } catch (err) {
        console.error("JWT Verification Failed:", err.message);
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
    }

});

wss.on("connection", setupWSConnection);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`WebSocket Server is Running on PORT ${PORT}`);
});