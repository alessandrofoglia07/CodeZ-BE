import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import authRouter from './routers/auth.js';
import usersRouter from './routers/users.js';
import projectsRouter from './routers/projects.js';
import adminRouter from './routers/admin.js';

dotenv.config();

const app = express();

export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI;
const API_VERSION = process.env.API_VERSION || 'v1';
export const adminEnv = process.env.ADMIN_KEY;

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';

if (!adminEnv) {
    console.log('No admin environment provided. Make sure to set the ADMIN_KEY environment variable for accessing the admin router.');
}

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error('No GitHub client ID or secret provided. Make sure to set the GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.');
}

app.use(express.json());
app.use(
    cors({
        origin: CLIENT_URL
    })
);

const baseUri = `/api/${API_VERSION}`;

app.use(`${baseUri}/auth`, authRouter);
app.use(`${baseUri}/users`, usersRouter);
app.use(`${baseUri}/projects`, projectsRouter);
app.use(`${baseUri}/admin`, adminRouter);

await (async () => {
    try {
        if (!MONGO_URI) {
            console.log('Connection to MongoDB failed: no URI provided. Make sure to set the MONGO_URI environment variable.');
        } else {
            await connect(MONGO_URI);
            console.log('Connected to MongoDB');
        }

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.log(err);
    }
})();

app.use(express.static('public'));

app.all('*', (_req: Request, res: Response) => res.sendStatus(404));
