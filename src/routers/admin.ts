import { Router, type Request, type Response } from 'express';
import checkAdmin from '../middlewares/checkAdmin.js';
import Project from '../models/project.js';
import File from '../models/file.js';

const router = Router();

router.use(checkAdmin);

router.get('/', (_req, res) => {
    res.json({ message: 'This is the admin panel of CodeZ server.' });
});

router.delete('/all-projects', async (_req: Request, res: Response) => {
    Project.deleteMany({});
    File.deleteMany({});
    res.json({ message: 'All projects deleted.' });
});

export default router;
