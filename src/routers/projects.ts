import { Router, type Response } from 'express';
import type { AuthRequest } from '../types.js';
import verifyUser from '../middlewares/verifyUser.js';
import User from '../models/user.js';
import Project from '../models/project.js';
import { z } from 'zod';
import axios from 'axios';

const router = Router();

router.use(verifyUser);

router.get('/', async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.userId).populate('projects');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const projects = user.projects;
    return res.json(projects);
});

router.post('/', async (req: AuthRequest, res: Response) => {
    const { githubLink } = req.body;

    // Validate githubLink
    const githubLinkSchema = z
        .string()
        .url('Invalid URL')
        .regex(/^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.git$/, 'Link must be a GitHub repository');

    const githubLinkValidation = githubLinkSchema.safeParse(githubLink);
    if (!githubLinkValidation.success) return res.status(400).json({ message: githubLinkValidation.error.errors[0]?.message });

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const author = githubLink.split('/')[3];
        const repo = githubLink.split('/')[4].split('.')[0];

        const project = new Project({
            name: repo,
            owner: req.userId,
            collaborators: [req.userId],
            url: githubLink
        });

        await project.save();

        const githubUrl = process.env.GITHUB_URL || 'https://api.github.com';
        const files = (await axios.get(`${githubUrl}/repos/${author}/${repo}/contents`)).data;

        res.status(201).json({ project, files });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

export default router;
