import { CLIENT_URL } from '../index.js';
import type { UserDocument } from '../types.js';

const clientLoginUrl = (user: UserDocument, accessToken: string, refreshToken: string, redirect?: string) => {
    const params = new URLSearchParams({
        accessToken,
        refreshToken,
        userId: user.id,
        username: user.username
    });
    if (user.email) params.append('email', user.email);
    if (user.profile_img) params.append('profile_img', user.profile_img);

    const url = new URL(redirect || CLIENT_URL);

    url.search = params.toString();

    return url.toString();
};

export default clientLoginUrl;
