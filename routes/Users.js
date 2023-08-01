import express from "express";
import { GetMyProfile, Login, Logout, Register } from "../controllers/Users.js";
import { IsAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", IsAuthenticated, Logout);
router.get("/profile",IsAuthenticated ,GetMyProfile);

export default router;
