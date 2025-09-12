import express from "express";
import { getRoastResponse } from "../controllers/roastController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, getRoastResponse)

export default router;