import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/security';
import { connectDB } from './config/db';

// Load routes
import contactRoutes from './routes/contact';
import safeguardingRoutes from './routes/safeguarding';
import donationRoutes from './routes/donations';
import membershipRoutes from './routes/membership';
import newsletterRoutes from './routes/newsletter';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB Atlas
connectDB();

// Middlewares
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: true, // Accepte toutes les origines (Vercel, mobile, localhost)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate Limiting
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/safeguarding', safeguardingRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/membership', membershipRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/content', contentRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`[Server] Bright African API running on port ${PORT}`);

  // Self-ping pour maintenir le serveur actif sur Render (toutes les 10 minutes)
  const RENDER_URL = 'https://brightafrica-api.onrender.com/health';
  setInterval(() => {
    fetch(RENDER_URL)
      .then(res => console.log(`[Keep-Alive Ping] ${new Date().toISOString()} - Status: ${res.status}`))
      .catch(err => console.warn('[Keep-Alive Ping Error]:', err.message));
  }, 10 * 60 * 1000); // 10 minutes
});
