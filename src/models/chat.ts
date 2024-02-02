import { Schema, model, SchemaTypes } from 'mongoose';
import { type ChatDocument } from '../types.js';

const ChatSchema = new Schema<ChatDocument>(
    {
        project: {
            type: SchemaTypes.ObjectId,
            ref: 'Project'
        },
        messages: {
            type: [
                {
                    type: SchemaTypes.ObjectId,
                    ref: 'Message'
                }
            ],
            default: []
        },
        users: {
            type: [
                {
                    type: SchemaTypes.ObjectId,
                    ref: 'User'
                }
            ],
            default: []
        }
    },
    { timestamps: true }
);

export default model<ChatDocument>('Chat', ChatSchema);
