import { app } from "./app.js";
import { connectToMongo } from "./data/db.js";

import { Server } from "socket.io";
const port = process.env.PORT;

connectToMongo();

const server = app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: { origin: process.env.FRONTEND_URL },
});

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined the Room: " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stoptyping", (room) => {
    socket.in(room).emit("stoptyping");
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived;
    console.log(chat);

    if (!chat.users) return console.log("chat.users is not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      else socket.in(user).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._Id);
  });
});
