import { Schema, model, SchemaTypes } from 'mongoose';
import { type MessageDocument } from '../types.js';

const MessageSchema = new Schema<MessageDocument>(
    {
        chat: {
            type: SchemaTypes.ObjectId,
            ref: 'Chat'
        },
        user: {
            type: SchemaTypes.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 1024
        }
    },
    { timestamps: true }
);

export default model<MessageDocument>('Message', MessageSchema);
