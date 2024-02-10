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

const CLIENT_URL = process.env.CLIENT_URL || '*';
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const API_VERSION = process.env.API_VERSION || 'v1';
export const adminEnv = process.env.ADMIN_KEY;

if (!adminEnv) {
    console.log('No admin environment provided. Make sure to set the ADMIN_KEY environment variable for accessing the admin router.');
}

app.use(express.json());
app.use(
    cors({
        origin: CLIENT_URL
    })
);

app.use(`/api/${API_VERSION}/auth`, authRouter);
app.use(`/api/${API_VERSION}/users`, usersRouter);
app.use(`/api/${API_VERSION}/projects`, projectsRouter);
app.use(`/api/${API_VERSION}/admin`, adminRouter);

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
