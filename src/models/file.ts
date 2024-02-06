import { Schema, model } from 'mongoose';
import { type FileDocument } from '../types.js';

const FileSchema = new Schema<FileDocument>(
    {
        name: {
            type: String,
            required: true
        },
        content: {
            type: String
        },
        type: {
            type: String,
            enum: ['file', 'folder'],
            required: true
        },
        path: {
            type: String,
            required: true
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        }
    },
    { timestamps: true }
);

export default model<FileDocument>('File', FileSchema);
