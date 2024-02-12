import { CLIENT_URL } from '../index.js';
import type { UserDocument } from '../types.js';

const clientLoginUrl = (user: UserDocument, accessToken: string, refreshToken: string) => {
    const params = new URLSearchParams({
        accessToken,
        refreshToken,
        userId: user.id,
        username: user.username
    });
    if (user.email) params.append('email', user.email);

    const url = new URL(CLIENT_URL);

    url.search = params.toString();

    return url.toString();
};

export default clientLoginUrl;
