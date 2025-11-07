// server.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// ✅ Fake robot data (until Raspberry Pi connected)
function getFakeRobotData() {
  return {
    temperature: (25 + Math.random() * 10).toFixed(1),
    gas: (Math.random() * 100).toFixed(0),
    humanDetected: Math.random() > 0.7 ? "YES" : "NO",
    gps: {
      lat: 6.9271 + (Math.random() - 0.5) * 0.0005,
      lng: 79.8612 + (Math.random() - 0.5) * 0.0005,
      alt: 10 + Math.random() * 2
    }
  };
}

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("robot-command", (cmd) => {
    console.log("Robot Command:", cmd);
  });

  socket.on("autopilot", (state) => {
    console.log("Autopilot:", state ? "ON" : "OFF");
  });

  // ✅ Stream Fake data
  const interval = setInterval(() => {
    socket.emit("robot-data", getFakeRobotData());
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 3030;
http.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server on port ${PORT}`)
);


