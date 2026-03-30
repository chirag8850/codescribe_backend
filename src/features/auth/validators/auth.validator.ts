import { z } from 'zod';

export const signupSchema = z.object({
    avatar: z
        .string()
        .trim()
        .pipe(z.url({ error: 'Avatar must be a valid URL' }))
        .optional(),
    name: z.string({ error: 'Name is required' }).trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
    username: z
        .string({ error: 'Username is required' })
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
        .regex(/(?=.*[a-zA-Z])/, 'Username must contain at least one letter')
        .toLowerCase(),
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

export const checkUsernameSchema = z.object({
    username: z
        .string({ error: 'Username is required' })
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
        .regex(/(?=.*[a-zA-Z])/, 'Username must contain at least one letter')
        .toLowerCase(),
});

export const loginWithPasswordSchema = z.object({
    identifier: z.string({ error: 'Email or username is required' }).trim().toLowerCase(),
    password: z.string({ error: 'Password is required' }).min(8, 'Password must be at least 8 characters'),
});

export const sendLoginOtpSchema = z.object({
    identifier: z.string({ error: 'Email or username is required' }).trim().toLowerCase(),
});

export const verifyLoginOtpSchema = z.object({
    identifier: z.string({ error: 'Email or username is required' }).trim().toLowerCase(),
    otp: z
        .string({ error: 'OTP is required' })
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string({ error: 'Email is required' })
        .trim()
        .toLowerCase()
        .pipe(z.email({ error: 'Invalid email address' })),
});

export const resetPasswordSchema = z.object({
    userId: z.string({ error: 'User ID is required' }),
    token: z.string({ error: 'Reset token is required' }),
    newPassword: z
        .string({ error: 'New password is required' })
        .min(8, 'Password must be at least 8 characters')
        .max(64, 'Password must be at most 64 characters'),
});

export const changePasswordSchema = z.object({
    newPassword: z
        .string({ error: 'New password is required' })
        .min(8, 'Password must be at least 8 characters')
        .max(64, 'Password must be at most 64 characters'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type ResendVerifyEmailInput = z.infer<typeof resendVerifyEmailSchema>;
export type CheckUsernameInput = z.infer<typeof checkUsernameSchema>;
export type LoginWithPasswordInput = z.infer<typeof loginWithPasswordSchema>;
export type SendLoginOtpInput = z.infer<typeof sendLoginOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type VerifyLoginOtpInput = z.infer<typeof verifyLoginOtpSchema>;
