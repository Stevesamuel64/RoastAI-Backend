import express from "express";
import {
  getUser,
  loginUser,
  signupUser,
  logoutUser,
  verifyUser
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/me", authMiddleware, getUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/verify/:token", verifyUser);

export default router;