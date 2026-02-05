import 'dotenv/config'; // Must be first to load env vars before other imports
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './utils/logging';
import { requireAuth } from './api/middleware/auth';
import productRoutes from './api/routes/products';
import galleryRoutes from './api/routes/gallery';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Serve static uploads for MVP (Local storage)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'altinbas-ai-engine' });
});

// API Routes
const apiRouter = express.Router();

// Apply auth middleware to API routes
apiRouter.use(requireAuth);

// Routes
apiRouter.use('/products', productRoutes);
apiRouter.use('/gallery', galleryRoutes);

app.use('/api/v1', apiRouter);

// Error Handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal Server Error', code: 'E5000' });
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
}

export default app;
