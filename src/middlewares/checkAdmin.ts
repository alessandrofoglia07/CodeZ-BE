import { type Request, type Response, type NextFunction } from 'express';
import { adminEnv } from '../index.js';

const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!adminEnv || req.headers.authorization !== adminEnv) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
};

export default checkAdmin;
