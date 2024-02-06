import { type Request, type Response, type NextFunction } from 'express';

const adminEnv = process.env.ADMIN_KEY;

const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!adminEnv || req.headers.authorization !== adminEnv) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
};

export default checkAdmin;
