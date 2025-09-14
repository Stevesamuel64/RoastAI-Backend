import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getFunnyFeud } from '../controllers/FunnyFeudController.js';
const router = express.Router();

router.post('/', authMiddleware, getFunnyFeud);

export default router;
