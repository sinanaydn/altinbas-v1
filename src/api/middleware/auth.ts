import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logging';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement Clerk authentication verification
    // For MVP skeleton, we assume all requests are authorized or check for a mock header

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // In a real scenario this would return 401
        // logger.warn('Missing authorization header');
        // return res.status(401).json({ error: 'Unauthorized' });
    }

    // logger.info('Auth check passed (Stub)');
    next();
};
