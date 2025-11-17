const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// --- Socket.io events ---
io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    // 1. Robot Command Listener (Unchanged)
    socket.on("robot-command", (cmd) => {
        console.log("🎮 Robot Command:", cmd);
        io.emit("robot-command", cmd);
    });

    // 2. Autopilot Listener (Unchanged)
    socket.on("autopilot", (state) => {
        console.log("🤖 Autopilot:", state ? "ON" : "OFF");
    });

    // 3. Sensor Data Listener (Receives Temp, GPS, Gas - Human Detection REMOVED)
    socket.on("robot-data", (data) => {
        // Forward sensor data to all dashboards
        io.emit("robot-data", data);
        console.log("📡 Sensor Data forwarded:", data);
    });
    
    // 4. NEW: Human Detection Status Listener
    socket.on("human-detection-status", (status) => {
        // This is sent by raw_stream.py ("Disabled") or yolo_stream.py ("YES"/"NO")
        // Forward this status to all dashboards for display
        io.emit("human-detection-status", status); 
        console.log(`👁️ Human Detection Status: ${status}`);
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3030;
http.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});











