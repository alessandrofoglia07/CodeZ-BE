import axios from 'axios';
import { Router, type Request, type Response } from 'express';
import GithubAuthState from '../models/githubAuthState.js';
import { v4 as uuid } from 'uuid';
import User from '../models/user.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { CLIENT_URL, GITHUB_API_URL } from '../index.js';

const router = Router();

router.get('/github', async (_req: Request, res: Response) => {
    const state = uuid();

    try {
        const authState = new GithubAuthState({ state });
        await authState.save();

        res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/github/callback', async (req: Request, res: Response) => {
    const { code, state } = req.query;

    try {
        // Check if state is valid (if not, the request is likely from a third-party and should abort)
        const storedState = await GithubAuthState.findOne({ state });
        if (!storedState) {
            return res.redirect(CLIENT_URL! + '?error=state');
        }
        // Token expires after 10 minutes
        if (storedState.createdAt.getTime() + 600000 < Date.now()) {
            await storedState.deleteOne();

            return res.redirect(CLIENT_URL! + '?error=state');
        }
        await storedState.deleteOne();

        // Exchange the code for an access token
        const githubAccessToken = (
            await axios.post(
                `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
                {},
                {
                    headers: {
                        Accept: 'application/json'
                    }
                }
            )
        ).data.access_token;

        // Get the user's GitHub profile
        const githubUser = (
            await axios.get(`${GITHUB_API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${githubAccessToken}`
                }
            })
        ).data;

        // Check if the user already exists in the database
        const storedUser = await User.findOne({ githubId: githubUser.id });

        // If the user exists, redirect to the client with the access token (login the user)
        if (storedUser) {
            const accessToken = generateAccessToken(storedUser);
            const refreshToken = generateRefreshToken(storedUser);

            return res.redirect(CLIENT_URL! + `?accessToken=${accessToken}&refreshToken=${refreshToken}`);
        }

        // If the user doesn't exist, create a new user and redirect to the client with the access token (register and login the user)
        const user = new User({
            username: githubUser.login || githubUser.username,
            githubId: githubUser.id,
            profile_img: githubUser.avatar_url || githubUser.photos[0].value,
            email: githubUser.email || undefined,
            accessToken: githubAccessToken
        });

        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.redirect(CLIENT_URL! + `?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (err) {
        console.log(err);
        res.redirect(CLIENT_URL! + '?error=auth');
    }
});

export default router;
