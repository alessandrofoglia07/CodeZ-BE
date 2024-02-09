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
        // TODO: Maybe add a field to check if the file is modified or not (if not, we don't need to save it in the database again, we can just use the GitHub API to get the file content when needed)
    },
    { timestamps: true }
);

export default model<FileDocument>('File', FileSchema);
