import { Schema, model, SchemaTypes } from 'mongoose';
import { type ProjectDocument } from '../types.js';
import { githubUrlRegex } from '../utils/validation.js';

const projectSchema = new Schema<ProjectDocument>(
    {
        name: {
            type: String,
            required: true
        },
        collaborators: [
            {
                type: SchemaTypes.ObjectId,
                ref: 'User'
            }
        ],
        url: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => {
                    return githubUrlRegex.test(v);
                },
                message: 'Invalid URL'
            }
        },
        owner: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },
        deltas: {
            type: [
                {
                    type: SchemaTypes.ObjectId,
                    ref: 'Delta'
                }
            ],
            default: []
        }
    },
    { timestamps: true }
);

export default model<ProjectDocument>('Project', projectSchema);
