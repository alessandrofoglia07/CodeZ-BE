import { Schema, model, SchemaTypes } from 'mongoose';
import { type UserDocument } from '../types.js';
import { z } from 'zod';

const profileImgValidator = {
    validator: (img: string) => {
        return z.string().url().safeParse(img).success;
    },
    message: 'Invalid URL'
};

const UserSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true
        },
        githubId: {
            type: String,
            required: true
        },
        profile_img: {
            type: String,
            validate: profileImgValidator
        },
        projects: {
            type: [
                {
                    type: SchemaTypes.ObjectId,
                    ref: 'Project'
                }
            ],
            default: []
        },
        friends: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                }
            ],
            default: []
        },
        githubToken: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default model<UserDocument>('User', UserSchema);
