import { Router, type Request, type Response } from 'express';
import User from '../models/user.js';
import validateCredentials from '../middlewares/validateCredentials.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/signup', validateCredentials, async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const emailAlreadyUsed = Boolean(await User.findOne({ email }));
        if (emailAlreadyUsed) return res.status(409).json({ message: 'Email already used' });

        const user = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        });

        await user.save();

        return res.status(201).json({ message: 'User created' });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.status(401).json({ message: 'Wrong password' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.status(200).json({ accessToken, refreshToken, message: 'Login successful', email: user.email, username: user.username });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

router.post('/refresh-token', async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!process.env.REFRESH_TOKEN_SECRET) throw new Error('REFRESH_TOKEN_SECRET env variable not found');
    if (!refreshToken) return res.sendStatus(401);

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: unknown, result: unknown) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            if (!result || typeof result !== 'object' || !('userId' in result)) return res.status(403).json({ message: 'Invalid refresh token' });

            const userId = result.userId;
            const user = await User.findById(userId);

            if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

            const accessToken = generateAccessToken(user);
            res.json({ accessToken, message: 'New access token generated' });
        });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

export default router;
