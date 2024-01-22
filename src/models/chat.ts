import { Schema, model, SchemaTypes } from 'mongoose';
import { type ChatDocument } from '../types.js';

const ChatSchema = new Schema<ChatDocument>(
    {
        session: {
            type: SchemaTypes.ObjectId,
            ref: 'Session'
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
