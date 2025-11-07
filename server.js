// server.js - full file for Render or local use
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve dashboard files
app.use(express.static("public"));

// ✅ Simulated Robot Data (Replace with real sensors later)
function getFakeRobotData() {
  return {
    temperature: (25 + Math.random() * 10).toFixed(1), // °C
    gas: (Math.random() * 100).toFixed(0), // gas level %
    humanDetected: Math.random() > 0.7 ? "YES" : "NO",
    gps: {
      lat: 6.9271 + (Math.random() - 0.5) * 0.001,   // near Colombo 😂
      lng: 79.8612 + (Math.random() - 0.5) * 0.001
    }
  };
}

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // ✅ Receive driving + camera commands
  socket.on("robot-command", (cmd) => {
    console.log("Robot Command:", cmd);
  });

  // ✅ Autopilot ON/OFF
  socket.on("autopilot", (state) => {
    console.log("Autopilot:", state ? "ON" : "OFF");
  });

  // ✅ Send robot data every second
  const interval = setInterval(() => {
    const robotData = getFakeRobotData();
    socket.emit("robot-data", robotData);
  }, 1000);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    clearInterval(interval);
  });
});

// ✅ Port for Render / local
const PORT = process.env.PORT || 3030;
http.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

