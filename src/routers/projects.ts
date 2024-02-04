import { Router, type Response } from 'express';
import type { AuthRequest } from '../types.js';
import verifyUser from '../middlewares/verifyUser.js';
import User from '../models/user.js';
import Project from '../models/project.js';
import { z } from 'zod';

const router = Router();

router.use(verifyUser);

router.get('/', async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const projects = (await user.populate('projects')).projects;
    return res.json(projects);
});

router.post('/', async (req: AuthRequest, res: Response) => {
    const { name, description, collaborators } = req.body;

    // Validate name, description, and collaborators array
    const nameLengthErr = 'Name must be between 1 and 30 characters long';
    const nameSchema = z.string().min(1, nameLengthErr).max(30, nameLengthErr);
    const descriptionLengthErr = 'Description must be between 1 and 300 characters long';
    const descriptionSchema = z.string().min(1, descriptionLengthErr).max(300, descriptionLengthErr);
    const collaboratorsSchema = z.array(z.string());

    const nameValidation = nameSchema.safeParse(name);
    const descriptionValidation = descriptionSchema.safeParse(description);
    const collaboratorsValidation = collaboratorsSchema.safeParse(collaborators);

    if (!nameValidation.success) return res.status(400).json({ message: nameValidation.error.errors[0]?.message });
    if (!descriptionValidation.success) return res.status(400).json({ message: descriptionValidation.error.errors[0]?.message });
    if (!collaboratorsValidation.success) return res.status(400).json({ message: collaboratorsValidation.error.errors[0]?.message });

    try {
        const project = new Project({
            name,
            description,
            collaborators: collaborators.includes(req.userId) ? collaborators : [...collaborators, req.userId],
            files: [],
            owner: req.userId
        });

        await project.save();

        return res.status(201).json(project);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

export default router;
