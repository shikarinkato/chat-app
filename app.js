import express from "express";
import http from "http";
import cors from "cors";
export const app = express();
import { config } from "dotenv";
import userRouter from "./routes/Users.js";
import chatsRouter from "./routes/ChatsRoute.js";
import messageRouter from "./routes/Messsages.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewares/notFound.js";

config({
  path: "./data/config.env",
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatsRouter);
app.use("/api/v1/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Chal Gya  BC");
});

app.use(notFound);
