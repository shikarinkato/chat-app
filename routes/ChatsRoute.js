import express from "express";
import { IsAuthenticated } from "../middlewares/auth.js";
import {
  accessChats,
  addTogroup,
  creategroupChat,
  fetchChats,
  removefromGroup,
  renameGroupChat,
} from "../controllers/Chats.js";
const router = express.Router();

router
  .route("/:id")
  .get(IsAuthenticated, fetchChats)
  .post(IsAuthenticated, accessChats);
router.post("/group", IsAuthenticated, creategroupChat);
router.put("/grouprename", IsAuthenticated, renameGroupChat);
router.put("/addtogroup", IsAuthenticated, addTogroup);
router.put("/removed", IsAuthenticated, removefromGroup);

export default router;
