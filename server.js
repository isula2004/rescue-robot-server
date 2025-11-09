const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http); // dashboard clients

app.use(express.static("public"));

let latestData = {}; // keep last sensor data

// Socket.IO for dashboard
io.on("connection", (socket) => {
  console.log("✅ Dashboard connected:", socket.id);

  // send latest data immediately
  socket.emit("robot-data", latestData);

  socket.on("robot-command", (cmd) => console.log("🎮 Robot Command:", cmd));
  socket.on("autopilot", (state) => console.log("🤖 Autopilot:", state ? "ON" : "OFF"));
  socket.on("disconnect", () => console.log("❌ Dashboard disconnected:", socket.id));
});

// Optional: REST endpoint to receive Pi data via Socket.IO
const sio = require("socket.io")(http, { path: "/pi" });

sio.on("connection", (socket) => {
  console.log("✅ Pi connected via Socket.IO");

  socket.on("robot-data", (data) => {
    latestData = data;
    io.emit("robot-data", latestData); // broadcast to dashboards
  });

  socket.on("disconnect", () => console.log("❌ Pi disconnected"));
});

const PORT = 3030;
http.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);









