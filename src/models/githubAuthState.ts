import { Schema, model } from 'mongoose';
import { type GitHubAuthStateDocument } from '../types.js';

const githubAuthStateSchema = new Schema<GitHubAuthStateDocument>(
    {
        state: {
            type: String,
            required: true
        },
        redirect: {
            type: String
        }
    },
    { timestamps: true }
);

export default model<GitHubAuthStateDocument>('GithubAuthState', githubAuthStateSchema);

