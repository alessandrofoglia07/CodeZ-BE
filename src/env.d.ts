declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Default Node Environment
            NODE_ENV: 'development' | 'production';

            // Optional Environment Variables
            PORT?: string; // Default: '5000'
            CLIENT_URL?: string; // Default: 'http://localhost:3000'
            API_VERSION?: string; // Default: 'v1'
            ADMIN_KEY?: string; // Default: undefined
            GITHUB_API_URL?: string; // Default: 'https://api.github.com'

            // Required Environment Variables
            MONGO_URI: string;
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
            GITHUB_CLIENT_ID: string;
            GITHUB_CLIENT_SECRET: string;
        }
    }
}

export {};
