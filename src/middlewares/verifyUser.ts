import { type Response, type NextFunction } from 'express';
import { type AuthRequest } from '../types.js';
import jwt from 'jsonwebtoken';

const verifyUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: unknown, result: unknown) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(403).json({ message: 'Token expired' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        } else if (result && typeof result === 'object' && 'userId' in result) {
            req.userId = result.userId as string;
            next();
        } else {
            return res.status(403).json({ message: 'Invalid token' });
        }
    });
};

export default verifyUser;
