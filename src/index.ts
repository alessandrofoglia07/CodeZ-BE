import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import authRouter from './routers/auth.js';
import usersRouter from './routers/users.js';
import projectsRouter from './routers/projects.js';

dotenv.config();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || '*';
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(
    cors({
        origin: CLIENT_URL
    })
);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/projects', projectsRouter);

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
