const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Listen for connection event
io.on("connection", (socket) => {
  console.log("New client connected with id: ", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    console.log(`User with id ${socket.id} named ${data.userName} joined room ${data.room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected with id: ", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
