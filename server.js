const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("robot-command", (cmd) => {
    console.log("🎮 Robot Command:", cmd);
  });

  socket.on("autopilot", (state) => {
    console.log("🤖 Autopilot:", state ? "ON" : "OFF");
  });

  socket.on("robot-data", (data) => {
    // Forward to all other connected clients
    socket.broadcast.emit("robot-data", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3030;
http.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);








