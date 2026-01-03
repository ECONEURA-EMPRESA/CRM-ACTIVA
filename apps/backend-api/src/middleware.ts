import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Skip for Health Check
  if (req.path === '/' && req.method === 'GET') {
    return next();
  }

  // Allow Options
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(403).json({ error: 'Unauthorized: Invalid token' });
    return;
  }
};
