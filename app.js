import express from "express";
import http from "http";
import cors from "cors";
export const app = express();
import { config } from "dotenv";
import { Server } from "socket.io";
import userRouter from "./routes/Users.js";
import chatsRouter from "./routes/ChatsRoute.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewares/notFound.js";
config({
  path: "./data/config.env",
});

const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const io = new Server();
io.on("connection", () => {
  console.log("New Connection");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatsRouter);

app.get("/", (req, res) => {
  res.send("Chal Gya  BC");
});

app.use(notFound);
