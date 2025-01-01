import { Request, Response, NextFunction } from 'express';

// Middleware to check if the user has an "admin" role
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any; 
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Permission denied: Admin role required' });
  }

  next(); 
};
