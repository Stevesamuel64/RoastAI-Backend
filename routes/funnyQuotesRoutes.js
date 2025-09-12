import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getFunnyQuote } from "../controllers/FunnyQuotesController.js";
const router = express.Router();

router.get("/", authMiddleware, getFunnyQuote);

export default router;