const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http); // dashboard clients
const WebSocket = require("ws"); // Pi websocket

app.use(express.static("public"));

let latestData = {}; // keep last sensor data

// WebSocket server for Pi (on same port, different path)
const wss = new WebSocket.Server({ server: http, path: "/pi" });

wss.on("connection", (ws) => {
  console.log("✅ Pi connected via WebSocket");

  ws.on("message", (msg) => {
    try {
      latestData = JSON.parse(msg);
      io.emit("robot-data", latestData); // broadcast to dashboards
    } catch (err) {
      console.log("⚠️ Error parsing message:", err);
    }
  });

  ws.on("close", () => console.log("❌ Pi disconnected"));
});

// Socket.io for dashboard
io.on("connection", (socket) => {
  console.log("✅ Dashboard connected:", socket.id);

  // send latest data immediately
  socket.emit("robot-data", latestData);

  socket.on("robot-command", (cmd) => console.log("🎮 Robot Command:", cmd));
  socket.on("autopilot", (state) => console.log("🤖 Autopilot:", state ? "ON" : "OFF"));
  socket.on("disconnect", () => console.log("❌ Dashboard disconnected:", socket.id));
});

const PORT = 3030;
http.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);








