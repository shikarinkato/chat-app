import express from "express";
import { Login, Register, Allusers } from "../controllers/Users.js";
import { IsAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/", IsAuthenticated, Allusers);

export default router;
