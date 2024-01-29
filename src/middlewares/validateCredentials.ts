import { type Request, type Response, type NextFunction } from 'express';
import { usernameSchema, passwordSchema, emailSchema } from '../utils/validation.js';

const validateCredentials = (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    const usernameValidation = usernameSchema.safeParse(username);
    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);

    if (!usernameValidation.success) return res.status(400).json({ message: usernameValidation.error.errors[0]?.message });
    if (!emailValidation.success) return res.status(400).json({ message: emailValidation.error.errors[0]?.message });
    if (!passwordValidation.success) return res.status(400).json({ message: passwordValidation.error.errors[0]?.message });

    next();
};

export default validateCredentials;
