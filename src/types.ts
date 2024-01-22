import { Types, Document } from 'mongoose';

export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    profile_img?: string;
    sessions: Types.ObjectId[];
    friends: Types.ObjectId[];
    // settings: Record<string, unknown>; add this later
}

export interface SessionDocument extends Document {
    name: string;
    git_repo: string;
    collaborators: Types.ObjectId[];
    chat: Types.ObjectId;
}

export interface ChatDocument extends Document {
    session: Types.ObjectId;
    messages: Types.ObjectId[];
    users: Types.ObjectId[];
}

export interface MessageDocument extends Document {
    chat: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
}
