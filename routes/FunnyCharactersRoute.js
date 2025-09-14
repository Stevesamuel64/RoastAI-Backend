import express from 'express';
import { getFunnyCharacterResponse } from '../controllers/FunnyCharactersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, getFunnyCharacterResponse);

export default router;
