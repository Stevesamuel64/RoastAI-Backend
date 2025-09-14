import express from 'express';
import { saveNewsletter } from '../controllers/newsletterControllear.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', authMiddleware, saveNewsletter);

export default router;
