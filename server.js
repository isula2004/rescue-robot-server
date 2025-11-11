const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// --- Socket.io events ---
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // When any client sends a robot command (from dashboard)
  socket.on("robot-command", (cmd) => {
    console.log("🎮 Robot Command:", cmd);
    // Forward this command to all connected clients (especially the Pi)
    io.emit("robot-command", cmd);
  });

  socket.on("autopilot", (state) => {
    console.log("🤖 Autopilot:", state ? "ON" : "OFF");
  });

  socket.on("robot-data", (data) => {
    // Forward sensor data to all dashboards
    io.emit("robot-data", data);
    console.log("📡 Data forwarded:", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3030;
http.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});











