const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// For now, we keep sending fake data. Later, you can integrate real Pi sensor data.
function getFakeRobotData() {
  const gasValue = Math.floor(Math.random() * 1023);

  // Determine air safety level
  let airSafety = "✅ SAFE";
  if (gasValue > 700) airSafety = "🔴 DANGER";
  else if (gasValue > 400) airSafety = "⚠️ WARNING";

  return {
    temperature: (25 + Math.random() * 10).toFixed(1),
    airSafety,
    humanDetected: Math.random() > 0.7 ? "YES" : "NO",
    gps: {
      lat: 6.9271 + (Math.random() - 0.5) * 0.00015,
      lng: 79.8612 + (Math.random() - 0.5) * 0.00015,
      alt: 5 + Math.random() * 2,
    },
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







