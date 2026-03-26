import { z } from 'zod';

export const signupSchema = z.object({
    avatar: z
        .string()
        .trim()
        .pipe(z.url({ error: 'Avatar must be a valid URL' }))
        .optional(),
    name: z
        .string({ error: 'Name is required' })
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters'),
    username: z
        .string({ error: 'Username is required' })
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z
        .string({ error: 'Email is required' })
        .trim()
        .toLowerCase()
        .pipe(z.email({ error: 'Invalid email address' })),
    password: z
        .string({ error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters')
        .max(64, 'Password must be at most 64 characters'),
});

export const resendVerifyEmailSchema = z.object({
    email: z
        .string({ error: 'Email is required' })
        .trim()
        .toLowerCase()
        .pipe(z.email({ error: 'Invalid email address' })),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type ResendVerifyEmailInput = z.infer<typeof resendVerifyEmailSchema>;
