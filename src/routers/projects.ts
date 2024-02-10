import { Router, type Response } from 'express';
import type { AuthRequest } from '../types.js';
import verifyUser from '../middlewares/verifyUser.js';
import User from '../models/user.js';
import Project from '../models/project.js';
import { z } from 'zod';
import getFilesFromGitHub from '../utils/getFilesFromGitHub.js';
import { Types } from 'mongoose';

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

router.post('/new/empty', async (req: AuthRequest, res: Response) => {
    const { name, description, collaborators } = req.body;

    // Validate name, description, and collaborators array
    const nameLengthErr = 'Name must be between 1 and 30 characters long';
    const nameSchema = z.string().min(1, nameLengthErr).max(30, nameLengthErr);
    const descriptionLengthErr = 'Description must be between 1 and 300 characters long';
    const descriptionSchema = z.string().min(1, descriptionLengthErr).max(300, descriptionLengthErr);
    const collaboratorsSchema = z.array(z.string()).optional();

    const nameValidation = nameSchema.safeParse(name);
    const descriptionValidation = descriptionSchema.safeParse(description);
    const collaboratorsValidation = collaboratorsSchema.safeParse(collaborators);

    if (!nameValidation.success) return res.status(400).json({ message: nameValidation.error.errors[0]?.message });
    if (!descriptionValidation.success) return res.status(400).json({ message: descriptionValidation.error.errors[0]?.message });
    if (!collaboratorsValidation.success) return res.status(400).json({ message: collaboratorsValidation.error.errors[0]?.message });

    const newCollaborators = collaborators ? (collaborators.includes(req.userId) ? collaborators : [...collaborators, req.userId]) : [req.userId];

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const project = new Project({
            name,
            description,
            collaborators: newCollaborators,
            files: [],
            owner: req.userId
        });

        await project.save();

        user.projects.push(project._id);
        await user.save();

        return res.status(201).json(project);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.post('/new/github', async (req: AuthRequest, res: Response) => {
    const { githubLink, collaborators } = req.body;

    // Validate githubLink
    const githubLinkSchema = z
        .string()
        .url('Invalid URL')
        .regex(/^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.git$/, 'Link must be a GitHub repository');
    const collaboratorsSchema = z.array(z.string()).optional();

    const githubLinkValidation = githubLinkSchema.safeParse(githubLink);
    const collaboratorsValidation = collaboratorsSchema.safeParse(collaborators);

    if (!githubLinkValidation.success) return res.status(400).json({ message: githubLinkValidation.error.errors[0]?.message });
    if (!collaboratorsValidation.success) return res.status(400).json({ message: collaboratorsValidation.error.errors[0]?.message });

    const newCollaborators = collaborators ? (collaborators.includes(req.userId) ? collaborators : [...collaborators, req.userId]) : [req.userId];

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const author = githubLink.split('/')[3];
        const repo = githubLink.split('/')[4].split('.')[0];

        // TODO: get description from GitHub repository
        const description = `GitHub repository: ${githubLink}`;

        // Initialize new project
        const project = new Project({
            name: repo,
            description,
            collaborators: newCollaborators,
            files: [],
            owner: req.userId
        });

        await project.save();

        const files = await getFilesFromGitHub(author, repo, project._id);

        // Add files to project
        project.files = files as unknown as Types.ObjectId[];
        await project.save();

        user.projects.push(project._id);
        await user.save();

        return res.status(201).json(project);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

export default router;
