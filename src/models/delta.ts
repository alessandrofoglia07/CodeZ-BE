import { Schema, model } from 'mongoose';
import { type DeltaDocument } from '../types.js';

const DeltaSchema = new Schema<DeltaDocument>(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['add', 'delete', 'edit'],
            required: true
        },
        addedContent: {
            type: String
        },
        deletedContent: {
            type: String
        },
        editedContent: {
            type: String
        }
    },
    { timestamps: true }
);

export default model<DeltaDocument>('Delta', DeltaSchema);
