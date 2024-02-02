import { Types, Document } from 'mongoose';

export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    profile_img?: string;
    projects: Types.ObjectId[];
    friends: Types.ObjectId[];
    // settings: Record<string, unknown>; add this later
}

export interface ProjectDocument extends Document {
    name: string;
    description: string;
    collaborators: Types.ObjectId[];
    files: Types.ObjectId[];
    chat: Types.ObjectId;
    owner: Types.ObjectId;
}

export interface FileDocument extends Document {
    name: string;
    content: string;
    type: 'file' | 'folder';
    path: string;
    project: Types.ObjectId;
}

// TODO: implement chats later
export interface ChatDocument extends Document {
    project: Types.ObjectId;
    messages: Types.ObjectId[];
    users: Types.ObjectId[];
}

// TODO: implement chats later
export interface MessageDocument extends Document {
    chat: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
}
