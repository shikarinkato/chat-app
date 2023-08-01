import express from "express";
import http from "http";
import cors from "cors";
export const app = express();
import { config } from "dotenv";
import { Server } from "socket.io";
import userRouter from "./routes/Users.js";
import BodyParser from "body-parser";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewares/notFound.js";
config({
  path: "./data/config.env",
});

const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser());
app.use(cookieParser());

const io = new Server();
io.on("connection", () => {
  console.log("New Connection");
});

app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Chal Gya  BC");
});

app.use(notFound);
