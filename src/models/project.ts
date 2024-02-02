import { Schema, model, SchemaTypes } from 'mongoose';
import { type ProjectDocument } from '../types.js';

const projectSchema = new Schema<ProjectDocument>(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        collaborators: [
            {
                type: SchemaTypes.ObjectId,
                ref: 'User'
            }
        ],
        files: [
            {
                type: SchemaTypes.ObjectId,
                ref: 'File'
            }
        ],
        owner: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

export default model<ProjectDocument>('Project', projectSchema);
