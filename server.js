const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// ✅ Reduced GPS movement steps = smoother & slower movement
function getFakeRobotData() {
  return {
    temperature: (25 + Math.random() * 5).toFixed(1),
    gas: (Math.random() * 80).toFixed(0),
    humanDetected: Math.random() > 0.85 ? "YES" : "NO",
    gps: {
      lat: 6.9271 + (Math.random() - 0.5) * 0.00005,
      lng: 79.8612 + (Math.random() - 0.5) * 0.00005,
      alt: 5 + Math.random() * 1.5
    }
  };
}

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("robot-command", (cmd) => {
    console.log("🎮 Robot Command:", cmd);
  });

  socket.on("autopilot", (state) => {
    console.log("🤖 Autopilot:", state ? "ON" : "OFF");
  });

  const interval = setInterval(() => {
    socket.emit("robot-data", getFakeRobotData());
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("❌ Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3030;
http.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);




