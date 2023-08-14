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

io.on("connection", () => {
  console.log("New Connection");
});
