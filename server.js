import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import roastRoute from './routes/roastRoute.js';
import jwt from 'jsonwebtoken';
import newsletterRouter from './routes/newsletterRouter.js';
import funnyCharactersRoute from './routes/FunnyCharactersRoute.js';
import FunnyFeudRoute from './routes/FunnyFeudRoute.js';
import funnyQuotesRoutes from './routes/funnyQuotesRoutes.js';

const app = express();
dotenv.config();
connectDB();

const allowedOrigins = [
  'http://localhost:3000',
  'https://roast-ai-frontend.vercel.app',
  'https://roast-ai-frontend-di1v2non1-yash-s-projects-c74e4821.vercel.app',
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hi i am backend of RoastAI');
});

app.use('/api/users', userRoutes);
app.use('/api/roast', roastRoute);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/funny-characters', funnyCharactersRoute);
app.use('/api/funny-debate', FunnyFeudRoute);
app.use('/api/funny-quotes', funnyQuotesRoutes);

app.use('/api/check-auth', (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ authenticated: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true });
  } catch (error) {
    res.json({ authenticated: false });
    console.log(error);
  }
});

app.use((error, req, res, next) => {
  console.error('🔥 Error:', error.stack || error.message);

  const status = error.statusCode || 500;

  res.status(status).json({
    message: error.message || 'Something went wrong',
  });
});

app.listen(4000, () =>
  console.log(`🚀 Server running on http://localhost:4000`)
);
