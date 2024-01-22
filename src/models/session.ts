import { Schema, model, SchemaTypes } from 'mongoose';
import { type SessionDocument } from '../types.js';
import { z } from 'zod';

const githubRepoRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/;

const gitRepoValidator = {
    validator: (repo: string) => {
        return z.string().url().regex(githubRepoRegex).safeParse(repo).success;
    },
    message: 'Invalid URL'
};

const SessionSchema = new Schema<SessionDocument>(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 32,
            trim: true
        },
        git_repo: {
            type: String,
            required: true,
            validate: gitRepoValidator
        },
        collaborators: {
            type: [
                {
                    type: SchemaTypes.ObjectId,
                    ref: 'User'
                }
            ],
            default: []
        },
        chat: {
            type: SchemaTypes.ObjectId,
            ref: 'Chat'
        }
    },
    { timestamps: true }
);

export default model<SessionDocument>('Session', SessionSchema);
