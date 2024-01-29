import { z } from 'zod';

export const usernameLengthError = 'Username must be between 3 and 20 characters long';
export const passwordLengthError = 'Password must be between 8 and 20 characters long';

export const usernameSchema = z.string().min(3, usernameLengthError).max(20, usernameLengthError);
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, passwordLengthError).max(20, passwordLengthError);

export const authFormSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema
});
