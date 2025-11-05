// server.js - full file for Render
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public")); // serve your dashboard files

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("robot-command", (cmd) => {
    console.log("Robot Command:", cmd);
  });

  socket.on("autopilot", (state) => {
    console.log("Autopilot:", state ? "ON" : "OFF");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// use the port assigned by the host (Render) or fallback to 3000 locally
const PORT = process.env.PORT || 3030;
//boru comment
http.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
