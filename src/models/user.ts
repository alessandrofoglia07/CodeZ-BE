import { Schema, model, SchemaTypes } from 'mongoose';
import { type UserDocument } from '../types.js';
import { z } from 'zod';

const usernameValidator = {
    validator: (username: string) => {
        return z
            .string()
            .regex(/^[a-zA-Z0-9_]+$/)
            .safeParse(username).success;
    },
    message: 'Username can only contain letters, numbers, and underscores'
};

const emailValidator = {
    validator: (email: string) => {
        return z.string().email().safeParse(email).success;
    },
    message: 'Invalid email'
};

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
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 32,
            trim: true,
            validate: usernameValidator
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: emailValidator
        },
        password: {
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
        }
    },
    { timestamps: true }
);

export default model<UserDocument>('User', UserSchema);
