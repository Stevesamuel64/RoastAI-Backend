import express from "express";
import { getUser, loginUser, signupUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/me", authMiddleware, getUser);

export default router;