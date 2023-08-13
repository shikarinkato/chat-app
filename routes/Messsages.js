import express from "express";
import { IsAuthenticated } from "../middlewares/auth.js";
import { Allmessages, sendMessage } from "../controllers/Messages.js";

const router = express.Router();

router.post("/", IsAuthenticated, sendMessage);
router.get("/:chatID", IsAuthenticated, Allmessages);

export default router;
