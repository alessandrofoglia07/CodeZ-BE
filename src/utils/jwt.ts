import type { UserDocument } from '../types.js';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: UserDocument) => {
    if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('ACCESS_TOKEN_SECRET env variable not found');
    const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    return token;
};

export const generateRefreshToken = (user: UserDocument) => {
    if (!process.env.REFRESH_TOKEN_SECRET) throw new Error('REFRESH_TOKEN_SECRET env variable not found');
    const token = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return token;
};
