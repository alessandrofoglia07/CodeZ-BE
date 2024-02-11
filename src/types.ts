import type { Request } from 'express';
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
    url: string;
    collaborators: Types.ObjectId[];
    chat: Types.ObjectId;
    owner: Types.ObjectId;
    deltas: Types.ObjectId[];
}

// TODO: better typing for content editing later on
export interface DeltaDocument extends Document {
    type: 'add' | 'delete' | 'edit';
    filePath: string;
    project: Types.ObjectId;
    editedContent?: string;
    addedContent?: string;
    deletedContent?: string;
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

export interface AuthRequest extends Request {
    /** If verifyUser middleware used, access this with a *non-null assertion operator*
     * @example
     * router.get('/', verifyUser, (req: AuthRequest, res: Response) => {
     *    return res.json({ userId: req.userId! })
     * });
     */
    userId?: string;
}
