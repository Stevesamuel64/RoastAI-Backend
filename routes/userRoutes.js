import express from "express";
import {
  getUser,
  loginUser,
  signupUser,
  logoutUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/me", authMiddleware, getUser);
router.post("/logout", authMiddleware, logoutUser);

export default router;